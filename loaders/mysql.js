const Sequelize = require("sequelize");
const envConfig = require("../config");
async function initDB() {
    const sequelizeConn = new Sequelize(envConfig.database, envConfig.user, envConfig.password, {
        dialect: 'mysql',
        port: envConfig.port,
        dialectOptions: {
            typeCast: function (field, next) {
                if (field.type === 'DATETIME') {
                    return field.string()
                }
                return next()
            }
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
            acquire: 30000
        },
        timezone: '+08:00',
        logging: false,
        host: envConfig.host,
        raw: true
    })
    await sequelizeConn.authenticate();
    return sequelizeConn;
}
module.exports = { initDB }