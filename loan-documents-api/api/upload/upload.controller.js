// loan-documents-api/api/upload/upload.controller.js
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const dayjs = require('dayjs');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../../../service-account.json'),
});

const BUCKET_NAME = 'loansiya-client-data';
const bucket = storage.bucket(BUCKET_NAME);

exports.uploadLoanDocument = async (req, res) => {
  const { clientId, fileType } = req.params;

  if (!clientId || !fileType) {
    return res.status(400).json({ error: 'Missing clientId or fileType' });
  }

  const validTypes = ['application', 'agreement'];
  if (!validTypes.includes(fileType)) {
    return res.status(400).json({ error: 'Invalid fileType. Must be application or agreement.' });
  }

  try {
    const dateOnly = dayjs().format('YYYY-MM-DD');
    const filename = `loan-${fileType}.json`; // ✅ uniform file name
    const destination = `clients/${clientId}/${dateOnly}/${filename}`;

    const file = bucket.file(destination);
    await file.save(JSON.stringify(req.body), {
      contentType: 'application/json',
    });

    res.status(200).json({
      message: `${filename} uploaded successfully for ${clientId}`,
      path: destination,
    });
  } catch (error) {
    console.error('GCS upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
};
