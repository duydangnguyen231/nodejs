const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const port = 3000;

const mongo_uri = 'mongodb://localhost:27017';
var newuser = {name : "Duy" , password : "123", profession : "student", "_id": ObjectID(myId)}


app.get('/listUsers', (req, res) => {
  MongoClient.connect(mongo_uri, { useNewUrlParser: true })
  .then(client => {
    const db = client.db('test');
    const collection = db.collection('users');
    collection.find({}).toArray().then(response => res.status(200).json(response)).catch(error => console.error(error));
  });
});
var myId = JSON.parse(req.body.id);
app.post('/addUsers', (req, res) => {
  MongoClient.connect(mongo_uri, { useNewUrlParser: true })
  .then(client => {
    const db = client.db('test');
    const collection = db.collection('users');
  collection.insertOne(newuser).then(response => res.status(200).json(response)).catch(error => console.error(error));
  });
});

app.get('/:id', (req, res) => {
  const id = new ObjectId(req.params.id);
  MongoClient.connect(mongo_uri, { useNewUrlParser: true })
  .then(client => {
    const db = client.db('test');
    const collection = db.collection('users');
    collection.findOne({ _id: id }).then(response => res.status(200).json(response)).catch(error => console.error(error));
  });
});

app.listen(port, () => console.info(`REST API running on port ${port}`));