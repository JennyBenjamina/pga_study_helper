const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this creates readable names for the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Hello World!!!!!');
});

// create a post route to handle the file upload
app.post('/', uploads.array('files'), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  // console.log(req.files);

  res.send(req.body);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
