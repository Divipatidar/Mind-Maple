const admin = require('firebase-admin');
const { credential } = admin;
require('dotenv').config();

const cred = {
  "type": `${process.env.F_SERVICE_ACCOUNT}`,
  "project_id": `${process.env.F_PROJECT_ID}`,
  "private_key_id": `${process.env.F_PRIVATE_KEY_ID}`.replace(/\\n/g, '\n'),
  "private_key": `${process.env.F_PRIVATE_KEY}`,
  "client_email": `${process.env.F_CLIENT_EMAIL}`,
  "client_id": `${process.env.F_CLIENT_ID}`,
  "auth_uri": `${process.env.F_AUTH_URL}`,
  "token_uri": `${process.env.F_TOKEN_URL}`,
  "auth_provider_x509_cert_url": `${process.env.F_AUTH_PROVIDER}`,
  "client_x509_cert_url": `${process.env.F_CLIENT_URL}`,
  "universe_domain": `${process.env.F_DOMAIN}`
};

admin.initializeApp({
  credential: credential.cert(cred),
});

module.exports = admin;
