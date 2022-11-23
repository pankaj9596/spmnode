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
    async getGuestEntry(dbClient, GSTREGSEQID) {
        const query = `SELECT * FROM T_GUEST_REGISTERATION WHERE GSTREGSEQID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [GSTREGSEQID]
        });
        return result[0]
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
    async executeAction(dbClient, body, user, oGuestRequest) {
        if (body.ACTION === "APPROVE") {
            const VENDMSTRSEQID = uuidv4();
            //TODO : create method for update code
            const query = `UPDATE T_GUEST_REGISTERATION SET GENERATED_ID = ?, STATUS = ?, RET_REMARKS = ?, RET_ACTIONED_ON = current_timestamp ,
            RET_ACTIONED_BY = ?, VENDOR_CREATED = true , VENDOR_CREATED_ON = current_timestamp WHERE GSTREGSEQID = ?`;
            await dbClient.query(query, {
                replacements: [VENDMSTRSEQID, "APPROVED", body.REMARKS, user, body.GSTREGSEQID]
            });

            ["GSTREGSEQID", "STATUS", "PH_COUNTRY_CODE", "MODIFIED_ON", "VENDOR_CREATED", "VENDOR_CREATED_ON",
                "ALT_PH_COUNTRY_CODE", "ALTERNATE_PHN_NUMBER", "FAX_NUMBER", "NATURE_OF_BUSINESS",
                "DEPARTMENT", "SUBDEPARTMENT", "PRIMARY_CONTACT_NAME", "GENERATED_ID",
                "RET_REMARKS",
                "RET_ACTIONED_BY", "RET_ACTIONED_ON"].forEach(element => delete oGuestRequest[element]);

            //TODO : create method for insert 
            const COLUMN_NAMES = Object.keys(oGuestRequest).join(",");
            const sParam = '?,'.repeat(Object.keys(oGuestRequest).length).slice(0, -1);
            const COLUMN_VALUES = Object.values(oGuestRequest);
            const vendorQuery = `INSERT INTO T_VENDOR_MASTER  (VENDMSTRSEQID,${COLUMN_NAMES}) VALUES ('${VENDMSTRSEQID}',${sParam})`;
            await dbClient.query(vendorQuery, {
                replacements: COLUMN_VALUES
            });
        } else if (body.ACTION === "REJECT") {
            const query = `UPDATE T_GUEST_REGISTERATION SET  STATUS = ?, RET_REMARKS = ?, RET_ACTIONED_ON = current_timestamp ,
            RET_REMARKS = ?,VENDOR_CREATED = false WHERE GSTREGSEQID = ?`;
            await dbClient.query(query, {
                replacements: ["REJECTED", body.REMARKS, user, body.GSTREGSEQID]
            })
        }
        return {
            status_code: 204, response: undefined
        }
    }
};
module.exports = SupplierRepository;