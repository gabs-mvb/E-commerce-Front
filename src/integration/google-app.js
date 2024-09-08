const fs = require('fs')
const { google } = require('googleapis')
const GOOGLE_API_FOLDER_ID = '1psHGUSw7iOXCv3vl7wTdaoxNdoX5g8Fx'

var express = require("express");
var app = express();
var cors = require("cors");

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

app.use(cors());
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.post('/', upload.single('file'), (req, res) => {
  uploadFile(req, res)
});

async function uploadFile(req, res) {
  const file = req.file 

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './google-api/googledrive.json',
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const driveService = google.drive({
      version: 'v3',
      auth
    });

    const fileMetaData = {
      'name': file.originalname,
      'parents': [GOOGLE_API_FOLDER_ID]
    };

    const media = {
      mimeType: 'image/jpg',
      body: fs.createReadStream(file.path)
    };

    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id'
    });
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (err) {
    console.log('Upload file error', err);
    res.sendStatus(400);
  }
}


app.listen(8000, function () {
  console.log("Example app listening on port 8000!");
});