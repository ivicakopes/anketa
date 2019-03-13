const db = require('../database');

class PV {
  static retrieveAll (callback) {
    db.query('SELECT * from pitanja_vrste', (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  static insert (pitanje, vrsta, callback) {
    db.query('INSERT INTO pitanja_vrste (pitanje_id, vrsta_id) VALUES ($1,$2)', [pitanje, vrsta], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }
}

module.exports = PV;