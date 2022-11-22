const uuidv4 = require("../../util/uuid")
const { createFilter } = require('odata-v4-mysql');
class SupplierRepository {
    constructor() {

    }
    async getAllGuest(dbClient, queryParam) {
        let query = `SELECT * FROM T_GUEST_REGISTERATION`, aParam = [];
        if (queryParam.$filter) {
            const filter = createFilter(queryParam.$filter);
            query += ` AND ${filter.where}`;
            aParam.push(...filter.parameters);
        }
        const [result] = await dbClient.query(query, {
            replacements: aParam
        });
        return result
    }
    async registerGuest(dbClient, body, user = "anonymous") {
        body["CREATED_BY"] = user;
        body["MODIFIED_BY"] = user;
        body["STATUS"] = "SUBMIT";
        const COLUMN_NAMES = Object.keys(body).join(",");
        const sParam = '?,'.repeat(Object.keys(body).length).slice(0, -1);
        const COLUMN_VALUES = Object.values(body);
        const GSTREGSEQID = uuidv4();
        const query = `INSERT INTO T_GUEST_REGISTERATION (GSTREGSEQID,${COLUMN_NAMES}, CREATED_ON, MODIFIED_ON ) VALUES 
        ('${GSTREGSEQID}',${sParam},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
        await dbClient.query(query, {
            replacements: COLUMN_VALUES
        })
        return GSTREGSEQID;
    }
    async getByEmailID(dbClient, emailID) {
        const query = `SELECT * FROM T_GUEST_REGISTERATION WHERE EMAIL_ID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [emailID]
        });
        return result
    }
    async executeAction(dbClient, body, user) {

    }
};
module.exports = SupplierRepository;