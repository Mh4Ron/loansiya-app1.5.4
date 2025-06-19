const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, 'service-account.json'), // ✅ Make sure this path is correct
});

const bucketName = 'loansiya-client-data'; // ✅ Your GCS bucket name
const bucket = storage.bucket(bucketName);

// ✅ Get all clients from clients.json in GCS
async function getAllClients() {
  const file = bucket.file('clients/clients.json'); // adjust if you're using a folder
  const contents = await file.download();
  return JSON.parse(contents.toString());
}

// ✅ Save individual client scoring result
async function saveClientData(cid, data) {
  const file = bucket.file(`scores/${cid}.json`); // ✅ Now saved under "scores" folder
  await file.save(JSON.stringify(data, null, 2), {
    contentType: 'application/json',
  });
}

// ✅ Get one client's scoring result by file
async function getClientData(cid) {
  const file = bucket.file(`${cid}.json`);
  const contents = await file.download();
  return JSON.parse(contents.toString());
}

// Save metrics to GCS under client-metrics/{cid}.json
async function saveClientMetrics(cid, metrics) {
  const file = bucket.file(`client-metrics/processed/${cid}.json`);
  await file.save(JSON.stringify(metrics, null, 2), {
    contentType: 'application/json',
  });
}

module.exports = {
  saveClientData,
  getClientData,
  getAllClients,
  saveClientMetrics, 
};
