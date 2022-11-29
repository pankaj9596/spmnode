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
};
module.exports = CommonRepository;