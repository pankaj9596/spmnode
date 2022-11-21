const uuidv4 = require("../../util/uuid")
class CommonRepository {
    constructor() {

    }
    async saveAddress(dbClient, oAddress) {
        //Save address
        oAddress["VALID_TO"] = '2037-12-01';
        const ADR_COLUMN_NAMES = Object.keys(oAddress).join(",");
        const addressParam = '?,'.repeat(Object.keys(oAddress).length).slice(0, -1);
        const ADDSEQID = uuidv4();
        const adrQuery = `INSERT INTO T_ADDRESS (ADDSEQID,${ADR_COLUMN_NAMES}) VALUES ('${ADDSEQID}',${addressParam})`;
        const ADR_VALUES = Object.values(oAddress);
        await dbClient.query(adrQuery, {
            replacements: ADR_VALUES
        });
        return ADDSEQID;
    }
};
module.exports = CommonRepository;