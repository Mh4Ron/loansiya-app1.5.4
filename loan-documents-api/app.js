const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./api/upload/upload.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/uploads', uploadRoutes);

const PORT = process.env.PORT || 5602;
app.listen(PORT, () => console.log(`📦 loan-documents-api running on port ${PORT}`));
