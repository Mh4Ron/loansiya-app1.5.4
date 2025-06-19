const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5600;
const metricsRoute = require('./metricsRoute');

const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, 'service-account.json'),
});
const bucket = storage.bucket('loansiya-client-data');



// ✅ Import GCS helper
const { saveClientData, getClientData, getAllClients } = require('./gcsHelper');

app.use(cors());
app.use(express.json());
app.use(metricsRoute);


// 🟩 Route: Get all clients
app.get('/clients', async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (err) {
    console.error('❌ Error loading clients from GCS:', err);
    res.status(500).json({ error: 'Failed to load clients', details: err.message });
  }
});

// 🟩 Route: Get one client by CID
app.get('/client/:cid', async (req, res) => {
  try {
    const clients = await getAllClients();
    const client = clients.find(c => c.cid === req.params.cid);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (err) {
    console.error('❌ Error loading client by CID:', err);
    res.status(500).json({ error: 'Failed to load client', details: err.message });
  }
});


// 🟩 Credit scoring logic
const weights = {
  paymentHistory: 0.35,
  creditUtilization: 0.30,
  creditHistoryLength: 0.15,
  creditMix: 0.10,
  newInquiries: 0.10,
};

const logisticWeights = {
  intercept: -4,
  paymentHistory: 5,
  creditUtilization: -3,
  creditHistoryLength: 2,
  creditMix: 1,
  newInquiries: -2,
};

function calculateCreditScore(data) {
  const {
    paymentHistory,
    creditUtilization,
    creditHistoryLength,
    creditMix,
    newInquiries,
  } = data;

  const normalized = {
    paymentHistory: paymentHistory / 100,
    creditUtilization: 1 - (creditUtilization / 100),
    creditHistoryLength: Math.min(creditHistoryLength / 60, 1),
    creditMix: creditMix / 100,
    newInquiries: 1 - (newInquiries / 100),
  };

  const weightedSum =
    weights.paymentHistory * normalized.paymentHistory +
    weights.creditUtilization * normalized.creditUtilization +
    weights.creditHistoryLength * normalized.creditHistoryLength +
    weights.creditMix * normalized.creditMix +
    weights.newInquiries * normalized.newInquiries;

  return Math.round(300 + weightedSum * 550);
}

function calculateDefaultProbability(data) {
  const z =
    logisticWeights.intercept +
    logisticWeights.paymentHistory * (data.paymentHistory / 100) +
    logisticWeights.creditUtilization * (data.creditUtilization / 100) +
    logisticWeights.creditHistoryLength * (data.creditHistoryLength / 100) +
    logisticWeights.creditMix * (data.creditMix / 100) +
    logisticWeights.newInquiries * (data.newInquiries / 100);

  return parseFloat((1 / (1 + Math.exp(-z))).toFixed(4));
}

function classifyRisk(score) {
  if (score >= 800) return 'Exceptional';
  if (score >= 740) return 'Very Good';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

function getRecommendation(category) {
  if (category === 'Poor') return 'REVIEW OR DECLINE';
  if (category === 'Fair') return 'REVIEW';
  return 'APPROVE';
}

// 🟩 Route: Score endpoint
app.post('/score/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;

    // ⬇️ Load precomputed metrics
    const processedFile = bucket.file(`client-metrics/processed/${cid}.json`);
    const contents = await processedFile.download();
    const metrics = JSON.parse(contents.toString());

    const creditScore = calculateCreditScore(metrics);
    const defaultProbability = calculateDefaultProbability(metrics);
    const riskCategory = classifyRisk(creditScore);
    const recommendation = getRecommendation(riskCategory);

    const result = {
      timestamp: new Date().toISOString(),
      cid,
      input: metrics,
      creditScore,
      defaultProbability,
      riskCategory,
      recommendation,
    };

    // ⬇️ Save score result to scores folder
    const scoreFile = bucket.file(`scores/${cid}.json`);
    await scoreFile.save(JSON.stringify(result, null, 2), {
      contentType: 'application/json',
    });

    res.json(result);
  } catch (err) {
    console.error('❌ Error during scoring:', err);
    res.status(500).json({ error: 'Scoring failed', details: err.message });
  }
});



// 🟢 Start server
app.listen(PORT, () => {
  console.log(`✅ Credit Scoring API running on http://localhost:${PORT}`);
});
