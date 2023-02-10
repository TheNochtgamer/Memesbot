const crypto = require('crypto');
const https = require('https');
const { Message } = require('discord.js');

/**
 * @param {Message} message 
 * @param {Message} message2 
 * @returns {void}
 */
function sendHash(message, message2) {
    if (!confi.memeRepetidoReact) return;
    const msg2id = message2?.id;

    for (let index = 0; index < message.attachments?.size; index++) {
        https.get(message.attachments.at(index).proxyURL, (res) => {
            let hash = crypto.createHash('sha256');
            let hashDiges = '';
            hash.setEncoding('hex');
            res.pipe(hash);

            res.on('end', async () => {
                hash.end();
                hashDiges = hash.read();
                if (!hashDiges) return;

                try {
                    const sequelize = require('../../database');
                    const Hashes = require('../../database/models/hashes')(sequelize);

                    await Hashes.create({
                        hash: hashDiges,
                        msg_id: msg2id
                    }, { ignoreDuplicates: true });
                } catch (error) {
                    console.log("Hubo un error al intentar escribir en la base de datos:", error);
                    return;
                }
            });
        });
    }
}

module.exports = sendHash;