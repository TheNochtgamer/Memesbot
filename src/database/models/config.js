const { Sequelize, DataTypes } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 * @returns
 */
function run(sequelize) {
  const Config = sequelize.define("config", {
    instanciaID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    json: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return Config;
}

module.exports = run;
