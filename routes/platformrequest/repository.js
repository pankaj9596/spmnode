const e = require("express");
const uuidv4 = require("../../util/uuid")
class RetailerRepository {
    constructor() {

    }
    async getAllRequest(dbClient, queryParam) {
        const query = `SELECT * FROM T_PLATFORM_REQ_MASTER`;
        const [result] = await dbClient.query(query, {
            replacements: []
        });
        return result
    }
    async getPlatformRequest(dbClient, PFSEQID) {
        const query = `SELECT * FROM T_PLATFORM_REQ_MASTER WHERE PFSEQID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [PFSEQID]
        });
        return result[0]
    }
    async getByEmailID(dbClient, emailID) {
        const query = `SELECT * FROM T_PLATFORM_REQ_MASTER WHERE EMAIL_ID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [emailID]
        });
        return result
    }
    async addPlatformRequest(dbClient, body) {
        let ADDSEQID;
        if (body.ADDRESS) {
            //Save address
            const oAddress = body.ADDRESS[0];
            oAddress["VALID_TO"] = '2037-12-01';
            const ADR_COLUMN_NAMES = Object.keys(oAddress).join(",");
            const addressParam = '?,'.repeat(Object.keys(oAddress).length).slice(0, -1);
            ADDSEQID = uuidv4();
            const adrQuery = `INSERT INTO T_ADDRESS (ADDSEQID,${ADR_COLUMN_NAMES}) VALUES ('${ADDSEQID}',${addressParam})`;
            const ADR_VALUES = Object.values(oAddress);
            await dbClient.query(adrQuery, {
                replacements: ADR_VALUES
            });
            delete body.ADDRESS
        }
        body["ADDSEQID"] = ADDSEQID;
        const COLUMN_NAMES = Object.keys(body).join(",");
        const sParam = '?,'.repeat(Object.keys(body).length).slice(0, -1);
        const COLUMN_VALUES = Object.values(body);
        const PFSEQID = uuidv4();
        const query = `INSERT INTO T_PLATFORM_REQ_MASTER (PFSEQID,${COLUMN_NAMES}) VALUES ('${PFSEQID}',${sParam})`;
        await dbClient.query(query, {
            replacements: COLUMN_VALUES
        })
        return PFSEQID;
    }
    async executeAction(dbClient, body, user) {
        const oPlatformRequest = await this.getPlatformRequest(dbClient, body.PFSEQID);
        if (!oPlatformRequest) {
            return {
                status_code: 400, response: { message: "Platform request is not present" }
            }
        }
        if (body.ACTION === "APPROVE") {

            const RETSEQID = uuidv4();
            const query = `UPDATE T_PLATFORM_REQ_MASTER SET GENERATED_ID = ?, STATUS = ?, PF_ADMIN_REMARKS = ?, PF_ACTIONED_ON = current_timestamp ,
            PF_ACTIONED_BY = ? WHERE PFSEQID = ?`;
            await dbClient.query(query, {
                replacements: [RETSEQID, "PFADMINAPPROVED", body.REMARKS, user, body.PFSEQID]
            });

            ["PFSEQID", "REQ_TYPE", "TENANT_ID", "GENERATED_ID", "PRIMARY_CONTACT_NAME", "STATUS", "PF_ADMIN_REMARKS",
                "PF_ACTIONED_BY", "PF_ACTIONED_ON"].forEach(element => delete oPlatformRequest[element]);

            const COLUMN_NAMES = Object.keys(oPlatformRequest).join(",");
            const sParam = '?,'.repeat(Object.keys(oPlatformRequest).length).slice(0, -1);
            const COLUMN_VALUES = Object.values(oPlatformRequest);
            const retailQuery = `INSERT INTO T_RETAIL_MASTER (RETSEQID,${COLUMN_NAMES}) VALUES ('${RETSEQID}',${sParam})`;
            await dbClient.query(retailQuery, {
                replacements: COLUMN_VALUES
            })


        } else if (body.ACTION === "REJECT") {
            const query = `UPDATE T_PLATFORM_REQ_MASTER SET  STATUS = ?, PF_ADMIN_REMARKS = ?, PF_ACTIONED_ON = current_timestamp ,
            PF_ACTIONED_BY = ? WHERE PFSEQID = ?`;
            await dbClient.query(query, {
                replacements: ["PFADMINREJECTED", body.REMARKS, user, body.PFSEQID]
            })
        }
        return {
            status_code: 204, response: undefined
        }
    }
}

module.exports = RetailerRepository
