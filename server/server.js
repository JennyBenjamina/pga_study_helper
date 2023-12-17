const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!!!!!');
});

app.post('/', (req, res) => {
  console.log('post request');
  res.send('post request');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
