const express = require('express');
const routes = require('./routes/index.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Apple is listening on port ${PORT}`)
});