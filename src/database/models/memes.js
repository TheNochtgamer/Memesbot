const { Sequelize, DataTypes } = require("sequelize");

/**
 * @param {Sequelize} sequelize 
 * @returns 
 */
function run(sequelize) {
    const Memes = sequelize.define("memes", {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        msg_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mod_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verified: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        created: {
            type: DataTypes.TIME,
            allowNull: true,
        }
    });

    return Memes;
}

module.exports = run;