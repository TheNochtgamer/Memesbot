/**
 * @param {String} sql
 * @returns {Promise<Array>}
 */
async function getSql(sql) {
  const { sequelize } = require('../database');
  const res = await sequelize.query(sql);
  return res[0];
  /* database.query(sql, (err, res) => {
        if (err) reject(err);
        resolve(res);
    }); */
}

module.exports = getSql;
