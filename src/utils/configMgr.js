let totalConf = require('../config.json');

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
    async main() {
        const sequelize = require('../database');
        try {
            await sequelize.authenticate({retry: {max: 3}});
        } catch (error) {
            console.log('Hubo un error al intentar conectar a la base de datos:', error);
            return totalConf;
        }
        const Config = require('../database/models/config')(sequelize);
        try {
            await sequelize.sync();
        } catch (error) {
            console.log('Hubo un error al intentar sincronizar la base de datos:', error);
        }

        try {
            let res = await Config.findOne({
                where: {
                    instanciaID: process.env.CLIENTID
                },
                raw: true
            });
            console.log('Configuracion Actualizada');
            return JSON.parse(res.json);
        } catch (error) {
            console.log('Hubo un error con la configuracion:', error);
        }
    },
    async save() {
        const sequelize = require('../database');
        try {
            await sequelize.authenticate({retry: {max: 3}});
        } catch (error) {
            return new SaveResult(false, error);
        }
        const Config = require('../database/models/config')(sequelize);

        try {
            let rows = await Config.update({ json: JSON.stringify(confi) }, {
                where: {
                    instanciaID: process.env.CLIENTID
                }
            });
            if (rows[0] <= 0) {
                throw 'Ninguna fila fue afectada';
            }
        } catch (error) {
            return new SaveResult(false, error);
        }
        return new SaveResult(true, null);
    }
};