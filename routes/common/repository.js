const uuidv4 = require("../../util/uuid")
class CommonRepository {
    constructor() {

    }
    async saveAddress(dbClient, oAddress) {
        oAddress["VALID_TO"] = '2037-12-01';
        const sFields = Object.keys(oAddress).join(",");
        const addressParam = '?,'.repeat(Object.keys(oAddress).length).slice(0, -1);
        const ADDRESS_ID = uuidv4();
        const query = `INSERT INTO T_ADDRESS (ADDRESS_ID,${sFields}) VALUES ('${ADDRESS_ID}',${addressParam})`;
        const VALUES = Object.values(oAddress);
        await dbClient.query(query, {
            replacements: VALUES
        });
        return ADDRESS_ID;
    }
    async updateAddress(dbClient, oAddress, ADDRESS_ID) {
        const sFields = Object.keys(oAddress).join(" = ?, ");
        const query = `UPDATE T_ADDRESS SET ${sFields} = ? WHERE ADDRESS_ID = ?`;
        const aParam = Object.values(oAddress);
        await dbClient.query(query, {
            replacements: [...aParam, ADDRESS_ID]
        });
        return ADDRESS_ID;
    }
    async getAddress(dbClient, ADDRESS_ID) {
        const query = `SELECT * FROM T_ADDRESS  WHERE ADDRESS_ID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [ADDRESS_ID]
        });
        return result[0];
    }
    async addUser(dbClient, oUser, transaction) {
        const sFields = Object.keys(oUser).join(",");
        const sParam = '?,'.repeat(Object.keys(oUser).length).slice(0, -1);
        const USERMSTRSEQID = uuidv4();
        const query = `INSERT INTO T_USER_MASTER (USERMSTRSEQID,${sFields}) VALUES ('${USERMSTRSEQID}',${sParam})`;
        const aParam = Object.values(oUser);
        let config = {
            replacements: aParam
        };
        if (transaction) config.transaction = transaction;
        await dbClient.query(query, config);
        return USERMSTRSEQID;
    }
};
module.exports = CommonRepository;