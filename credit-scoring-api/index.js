const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5600;

app.use(cors());
app.use(express.json());

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

  const weightedSum =
    weights.paymentHistory * paymentHistory +
    weights.creditUtilization * (100 - creditUtilization) +
    weights.creditHistoryLength * creditHistoryLength +
    weights.creditMix * creditMix +
    weights.newInquiries * (100 - newInquiries);

  return Math.round(300 + (weightedSum / 100) * 550);
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

app.post('/score', (req, res) => {
  console.log('Received input for scoring:', req.body); // ✅ for debugging

  try {
    const data = req.body; // ✅ only declared once
    const creditScore = calculateCreditScore(data);
    const defaultProbability = calculateDefaultProbability(data);
    const riskCategory = classifyRisk(creditScore);
    const recommendation = getRecommendation(riskCategory);

    res.json({
      creditScore,
      defaultProbability,
      riskCategory,
      recommendation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Scoring failed', details: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Credit Scoring API running on http://localhost:${PORT}`);
});
