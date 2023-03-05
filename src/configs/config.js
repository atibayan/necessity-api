require('dotenv').config()
const env = process.env.NODE_ENV;

const dev = {
  db: {
    port: parseInt(process.env.DEV_APP_PORT) || 5000,
    host: process.env.DEV_APP_DATABASE,
  },
  auth: {
    audience: process.env.DEV_APP_AUTH0_AUDIENCE,
    domain: process.env.DEV_APP_AUTH0_DOMAIN
  },
  s3: {
    bucket: process.env.DEV_APP_BUCKET_NAME,
    region: process.env.DEV_APP_BUCKET_REGION,
    access_key_id: process.env.DEV_APP_ACCESS_KEY,
    secret_access_key: process.env.DEV_APP_SECRET_ACCESS_KEY,
  },
  cors : {
    client_origin: process.env.DEV_APP_CLIENT_ORIGIN
  }
};

const prod = {
  db: {
    port: parseInt(process.env.PROD_APP_PORT),
    host: process.env.PROD_APP_DATABASE,
  },
  auth: {
    audience: process.env.PROD_APP_AUTH0_AUDIENCE,
    domain: process.env.PROD_APP_AUTH0_DOMAIN
  },
  s3: {
    bucket: process.env.PROD_APP_BUCKET_NAME,
    region: process.env.PROD_APP_BUCKET_REGION,
    access_key_id: process.env.PROD_APP_ACCESS_KEY,
    secret_access_key: process.env.PROD_APP_SECRET_ACCESS_KEY,
  },
  cors : {
    client_origin: process.env.PROD_APP_CLIENT_ORIGIN
  }
}

const config = {
  dev,
  prod
};

module.exports = config[env];