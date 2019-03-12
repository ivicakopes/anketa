const db = require('../database');

class Vrste {
  static retrieveAll (callback) {
    db.query('SELECT naziv_vrste from vrste', (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  static insert (vrste, callback) {
    db.query('INSERT INTO vrste (naziv_vrste) VALUES ($1)', [vrste], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }
}

module.exports = Vrste;