const uuidv4 = require("../../util/uuid")
class CommonRepository {
    constructor() {

    }
    async saveAddress(dbClient, oAddress) {
        oAddress["VALID_TO"] = '2037-12-01';
        const ADR_COLUMN_NAMES = Object.keys(oAddress).join(",");
        const addressParam = '?,'.repeat(Object.keys(oAddress).length).slice(0, -1);
        const ADDSEQID = uuidv4();
        const query = `INSERT INTO T_ADDRESS (ADDSEQID,${ADR_COLUMN_NAMES}) VALUES ('${ADDSEQID}',${addressParam})`;
        const VALUES = Object.values(oAddress);
        await dbClient.query(query, {
            replacements: VALUES
        });
        return ADDSEQID;
    }
    async updateAddress(dbClient, oAddress, ADDSEQID) {
        const COLUMN_NAMES = Object.keys(oAddress).join(" = ?, ");
        const query = `UPDATE T_ADDRESS SET ${COLUMN_NAMES} = ? WHERE ADDSEQID = ?`;
        const VALUES = Object.values(oAddress);
        await dbClient.query(query, {
            replacements: [...VALUES, ADDSEQID]
        });
        return ADDSEQID;
    }
};
module.exports = CommonRepository;