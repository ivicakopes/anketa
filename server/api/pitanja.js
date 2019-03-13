var express = require('express');
var Pitanja = require('../models/pitanja');

var router = express.Router();

router.get('/', (req, res) => {
  Pitanja.retrieveAll((err, pitanja) => {
    if (err)
      return res.json(err);
    return res.json(pitanja);
  });
});

router.post('/', (req, res) => {
  var pitanje = req.body.pitanje;

  Pitanja.insert(pitanje, (err, result) => {
    if (err)
      return res.json(err);
    return res.json(result);
  });
});

module.exports = router;