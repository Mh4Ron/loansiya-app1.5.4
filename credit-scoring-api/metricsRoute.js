const express = require('express');
const router = express.Router();
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { saveClientMetrics } = require('./gcsHelper');

const storage = new Storage({
  keyFilename: path.join(__dirname, 'service-account.json'),
});
const bucket = storage.bucket('loansiya-client-data');

// ⬇️ POST /metrics/:cid will read 001-raw.json and upload to processed/001.json
router.post('/metrics/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const file = bucket.file(`client-metrics/${cid}-raw.json`);
    const contents = await file.download();
    const raw = JSON.parse(contents.toString());

    // ✅ Compute Payment History
    const totalPayments = raw.paymentHistoryLog.reduce((sum, l) => sum + l.onTimePayments + l.latePayments, 0);
    const onTimePayments = raw.paymentHistoryLog.reduce((sum, l) => sum + l.onTimePayments, 0);
    const paymentHistory = (onTimePayments / totalPayments) * 100;

    // ✅ Compute Credit Utilization
    const creditUtilization = (raw.utilizationData.totalUsed / raw.utilizationData.totalCreditLimit) * 100;

    // ✅ Compute Credit History Length (in months)
    const creditHistoryLength = Math.floor(
      (Date.now() - new Date(raw.creditHistoryStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // ✅ Compute Credit Mix
    const creditMix = Math.min(raw.creditAccounts.length * 10, 100);

    // ✅ Compute New Inquiries (past 12 months if using loanHistory)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const newInquiries = raw.loanHistory?.filter(entry => {
      const appliedDate = new Date(entry.dateApplied);
      return appliedDate >= oneYearAgo;
    }).length || 0;

    const computedMetrics = {
      cid,
      paymentHistory,
      creditUtilization,
      creditHistoryLength,
      creditMix,
      newInquiries, // ✅ Included here
    };

    await saveClientMetrics(cid, computedMetrics); // ⬅️ Save to processed folder

    res.json(computedMetrics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute and upload metrics', details: err.message });
  }
});


module.exports = router;
