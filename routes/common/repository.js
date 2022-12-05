const uuidv4 = require("../../util/uuid")
class CommonRepository {
    constructor() {

    }
    async saveAddress(dbClient, oAddress) {
        oAddress["VALID_TO"] = '2037-12-01';
        const sFields = Object.keys(oAddress).join(",");
        const addressParam = '?,'.repeat(Object.keys(oAddress).length).slice(0, -1);
        const ADDSEQID = uuidv4();
        const query = `INSERT INTO T_ADDRESS (ADDSEQID,${sFields}) VALUES ('${ADDSEQID}',${addressParam})`;
        const VALUES = Object.values(oAddress);
        await dbClient.query(query, {
            replacements: VALUES
        });
        return ADDSEQID;
    }
    async updateAddress(dbClient, oAddress, ADDSEQID) {
        const sFields = Object.keys(oAddress).join(" = ?, ");
        const query = `UPDATE T_ADDRESS SET ${sFields} = ? WHERE ADDSEQID = ?`;
        const aParam = Object.values(oAddress);
        await dbClient.query(query, {
            replacements: [...aParam, ADDSEQID]
        });
        return ADDSEQID;
    }
    async getAddress(dbClient, ADDSEQID) {
        const query = `SELECT * FROM T_ADDRESS  WHERE ADDSEQID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [ADDSEQID]
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