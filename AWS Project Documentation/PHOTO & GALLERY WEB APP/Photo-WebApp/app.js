require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();

const bucket = process.env.S3_BUCKET; // e.g. 'my-photo-upload-bucket-nivas'
const table = process.env.DDB_TABLE; // e.g. 'photos'

app.use(express.static('public'));
app.use(express.json());

// Upload Route
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path);
    const fileName = uuidv4() + path.extname(req.file.originalname);

    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      Body: fileContent,
      ContentType: req.file.mimetype
      // Remove ACL to avoid AccessControlListNotSupported
    };

    await s3.upload(uploadParams).promise();

    const photoUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const metadata = {
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description,
      imageUrl: photoUrl
    };

    await ddb.put({
      TableName: table,
      Item: metadata
    }).promise();

    res.status(200).send('Upload successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});

// Get All Photos
app.get('/photos', async (req, res) => {
  try {
    const data = await ddb.scan({ TableName: table }).promise();
    res.json(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading photos');
  }
});

// Delete Photo
app.delete('/photo/:id', async (req, res) => {
  const id = req.params.id;
  const imageUrl = req.body.imageUrl;
  const key = imageUrl.split('/').pop();

  try {
    await ddb.delete({
      TableName: table,
      Key: { id }
    }).promise();

    await s3.deleteObject({
      Bucket: bucket,
      Key: key
    }).promise();

    res.status(200).send('Photo deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting photo');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
