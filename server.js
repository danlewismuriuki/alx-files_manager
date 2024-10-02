const express = require('express');
const routes = require('./routes/index');

const app = express();

app.use(express.json({ limit: '50mb' }));

app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
