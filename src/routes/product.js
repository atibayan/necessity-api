const express = require("express");
const router = express.Router();
const { Products, Tags, Photos } = require("../models/Product");
const {
  uploadObject,
  deleteObject,
  getObjectSignedUrl,
} = require("../services/s3");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const crypto = require("crypto");
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const ObjectId = require("mongoose").Types.ObjectId;
const { startSession } = require("mongoose");

const buildProdDetails = async (product_id) => {
  const tags = await Tags.find({ product_id });
  const images = await Photos.find({ product_id });
  const tagsArray = [];
  const imagesArray = [];

  for (tag of tags) {
    tagsArray.push(tag.tag_name);
  }

  for (image of images) {
    const signedImage = await getObjectSignedUrl(image.image_name);
    imagesArray.push({ image_name: image.image_name, signedImage });
  }
  return { tagsArray, imagesArray };
};

router.get("/tags", async (req, res) => {
  const tags = await Tags.distinct("tag_name");
  res.send({ tags });
});

router.get("/", async (req, res) => {
  const products = [];

  const product_details = await Products.find();
  for (detail of product_details) {
    const pdObj = detail.toObject();
    const tagImgTuple = await buildProdDetails(pdObj._id.toString());
    pdObj.images = tagImgTuple.imagesArray;
    pdObj.tags = tagImgTuple.tagsArray;
    products.push(pdObj);
  }
  res.send({ products });
});

router.get("/:pid", async (req, res) => {
  const products = [];
  const product = await Products.findById(req.params.pid);
  const pdObj = product.toObject();
  const tagImgTuple = await buildProdDetails(pdObj._id);
  pdObj.images = tagImgTuple.imagesArray;
  pdObj.tags = tagImgTuple.tagsArray;
  products.push(pdObj);
  res.send({ products });
});

router.post("/:pid/photos", upload.array("image"), async (req, res) => {
  const product_id = req.params.pid;
  for (file of req.files) {
    const image_name = randomImageName();
    uploadObject(image_name, file.buffer, file.mimeType);
    const newPhoto = await Photos.create({ product_id, image_name });
  }
  await new Promise((r) => setTimeout(r, 5000)); // s3 needs delay
  res.send({ message: `Successfully posted photo` });
});

router.post("/:pid/tags", async (req, res) => {
  const product_id = req.params.pid;
  const tags = req.body.tags;
  for (tag_name of tags) {
    const newTag = await Tags.create({ product_id, tag_name });
  }
  await new Promise((r) => setTimeout(r, 1000));
  res.send({ message: `Successfully posted tags` });
});

router.post("/", async (req, res) => {
  await Products.create(req.body).then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: `Could not add the document` });
      });
});

router.delete("/:pid/photos/:imagename", async (req, res) => {
  const product_id = req.params.pid;
  const image_name = req.params.imagename;
  const photo = await Photos.deleteOne({ product_id, image_name });
  deleteObject(image_name);
  console.log(`Successfully deleted photo`);
  res.send();
});

router.delete("/:pid/tags/:tagname", async (req, res) => {
  const product_id = req.params.pid;
  const tag_name = req.params.tagname;
  const tag = await Tags.deleteOne({ product_id, tag_name });
  res.send();
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  const session = await startSession();

  try {
    session.startTransaction();

    const prod = await Products.deleteOne({ _id: id });
    const tag = await Tags.deleteMany({ product_id: id });
    const imagesKey = await Photos.find({ product_id: id });
    imagesKey.forEach((img) => deleteObject(img.image_name));
    const photo = await Photos.deleteMany({ product_id: id });
    await session.commitTransaction();
    session.endSession();
    res.send(`Successfully deleted product`);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(404).send("Failed to delete product");
  }
});

router.patch("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updates = req.body;
  await new Promise((r) => setTimeout(r, 1000));
  if (ObjectId.isValid(id)) {
    Products.updateOne({ _id: ObjectId(id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: `Could not update the document` });
      });
  } else {
    res.status(500).json({ error: `Not a valid document id` });
  }
});

module.exports = router;
