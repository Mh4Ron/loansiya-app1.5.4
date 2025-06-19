const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Multer setup – store temporarily in /uploads
const upload = multer({ dest: 'uploads/' });

// GCS config
const storage = new Storage({ keyFilename: 'service-account.json' });
const bucket = storage.bucket('loansiya-client-data');

// Upload endpoint
app.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const file = req.file;
    const cid = req.body.cid || 'UnknownCID';
    const fileType = req.body.fileType || 'document'; // e.g. validid, orcr
    const today = new Date().toISOString().split('T')[0]; // e.g. 2025-06-15

    // Ensure the correct extension
    const ext = file.originalname.split('.').pop(); // Keep original extension
    const filename = `${fileType.toLowerCase()}.${ext}`;
    const destination = `documents/${cid}/${today}/${filename}`;

    // Upload to GCS
    await bucket.upload(file.path, {
      destination,
      gzip: true,
      metadata: { cacheControl: 'no-cache' },
    });

    // Optional: get public or signed URL
    const [signedUrl] = await bucket.file(destination).getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    // Clean up local temp file
    fs.unlinkSync(file.path);

    res.status(200).json({
      success: true,
      fileUrl: signedUrl,
      uploadedTo: destination,
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Uploader running on http://localhost:${PORT}`);
});
