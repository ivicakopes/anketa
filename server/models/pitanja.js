const db = require('../database');

class Pitanja {
  

  static retrieveAll (callback) {
    db.query('SELECT * from pitanja', (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  static retrievePitanjeByTekst (pitanje,callback) {
    db.query(`SELECT * from pitanja where pitanje = $1`,[pitanje],(err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  static insert (pitanje, callback) {
    db.query('INSERT INTO pitanja (pitanje) VALUES ($1)', [pitanje], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }
}

module.exports = Pitanja;