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
module.exports = {
  sequelize,
  Config: require('./models/config')(sequelize),
  Hashes: require('./models/hashes')(sequelize),
  Memes: require('./models/memes')(sequelize),
};

// fs.readdirSync(path.join(__dirname, '/models'))
//   .filter(file => file.endsWith('.js'))
//   .forEach(file => {
//     const model = require(path.join(__dirname, '/models', file))(sequelize);
//     models[model.name.at(0).toUpperCase() + model.name.slice(1)] = model;
//   });

