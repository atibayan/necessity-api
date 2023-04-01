const config = require("../configs/config");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucket = config.s3.bucket;
const region = config.s3.region;
const accessKeyId = config.s3.access_key_id;
const secretAccessKey = config.s3.secret_access_key;

const client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function uploadObject(key, body, mimetype) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: mimetype,
  };

  return client.send(new PutObjectCommand(params));
}

function deleteObject(key) {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return client.send(new DeleteObjectCommand(params));
}

async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const oneHour = 3600;

  return await getSignedUrl(client, new GetObjectCommand(params), {
    expiresIn: oneHour,
  });
}

module.exports = {
  uploadObject,
  deleteObject,
  getObjectSignedUrl,
};
