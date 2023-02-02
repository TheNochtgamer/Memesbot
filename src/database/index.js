const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.BASENAME,
    process.env.BASEUSER,
    process.env.BASEPASS,
    {
        pool: { idle: 30 * 1000 },
        host: process.env.BASEIP,
        dialect: 'mysql',
        logging: false,
        define: { timestamps: false, freezeTableName: true },
    },
);

module.exports = sequelize;