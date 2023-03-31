const { Sequelize, DataTypes } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 * @returns
 */
function run(sequelize) {
  const Hashes = sequelize.define("hashes", {
    hash: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    msg_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  });

  return Hashes;
}

module.exports = run;
