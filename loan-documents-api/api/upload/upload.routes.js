// loan-documents-api/api/upload/upload.routes.js
const express = require('express');
const router = express.Router();
const { uploadLoanDocument } = require('./upload.controller');

router.post('/:clientId/:fileType', uploadLoanDocument);

module.exports = router;
