const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const url = process.env.MONGODB_URI ||
  'mongodb://localhost:27017/baby-names-service';

app.get('/:name/:gender', (req, res) => {
  const {name, gender} = req.params;
  let db = null;

  MongoClient.connect(url)
  .then(_db => {
    db = _db;
    const names = db.collection('names');
    return names.find({name, gender}, {_id: 0}).toArray();
  })
  .then(documents => {
    if (documents.length) {
      res.json(documents);
    } else {
      res.sendStatus(404);
    }
    return db.close();
  })
  .catch(err => {
    res.sendStatus(500);
    throw err;
  });
});

module.exports = app;
