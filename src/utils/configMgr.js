const { sequelize, Config } = require('../database');
const { confi } = require('.');

class SaveResult {
  /**
   * @param {Boolean} success
   * @param {Error} err
   */
  constructor(success, err) {
    this.success = success;
    this.err = err;
  }
}

module.exports = {
  async init() {
    try {
      await sequelize.authenticate({ retry: { max: 3 } });
    } catch (error) {
      console.log(
        'Hubo un error al intentar conectar a la base de datos:',
        error,
      );
    }

    try {
      await sequelize.sync();
    } catch (error) {
      console.log(
        'Hubo un error al intentar sincronizar la base de datos:',
        error,
      );
    }

    try {
      const res = await Config.findOne({
        where: {
          instanciaID: process.env.CLIENTID,
        },
        raw: true,
      });
      Object.assign(confi, JSON.parse(res.json));
      // for (const key in JSON.parse(res.json)) {
      //   confi[key] = JSON.parse(res.json)[key];
      // }
      console.log('Configuracion Actualizada');
    } catch (error) {
      console.log('Hubo un error con la configuracion:', error);
    }
  },
  async save() {
    try {
      await sequelize.authenticate({ retry: { max: 3 } });
    } catch (error) {
      return new SaveResult(false, error);
    }

    try {
      const rows = await Config.update(
        { json: JSON.stringify(confi) },
        {
          where: {
            instanciaID: process.env.CLIENTID,
          },
        },
      );
      if (rows[0] <= 0) {
        throw new Error('Ninguna fila fue afectada');
      }
    } catch (error) {
      return new SaveResult(false, error);
    }
    return new SaveResult(true, null);
  },
};

