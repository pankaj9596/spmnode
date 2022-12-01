const uuidv4 = require("../../util/uuid")
const { createFilter } = require('odata-v4-mysql');
class RetailerRepository {
    constructor() {

    }
    async getAllRequest(dbClient, queryParam) {
        let query = `SELECT * FROM T_PLATFORM_REQ_MASTER WHERE ACTIVE = TRUE`, aParam = [];
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
    async getPlatformRequest(dbClient, PFSEQID) {
        const query = `SELECT PFSEQID,REQ_TYPE,TITLESEQID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,COMPANY_NAME,EMAIL_ID,ALT_EMAIL_ID,REGISTRATION_DATE,STORE_COUNT,EMP_COUNT,
        PH_COUNTRY_CODE,PHONE_NUMBER,ADDSEQID,ALT_PH_COUNTRY_CODE,ALT_PHN_NUMBER,WEBSITE,OWNERSHIP_TYPE,REMARKS,ADDITIONAL_INFO,
        BUSINESS_CODE,BUSINESS_DESC,CONCESSIONAIRE_SUPPORT,STORE_FORMAT,LOGO,HEADER_1,SUBHEADER_1,SUBHEADER_2,BACKGROUND_IMAGE,
        FAX_NUMBER,TELE_FAX_NUMBER,AUTH_TYPE,PRIMARY_CONTACT_NAME,STATUS FROM T_PLATFORM_REQ_MASTER WHERE PFSEQID = ? AND ACTIVE = TRUE`;
        const [result] = await dbClient.query(query, {
            replacements: [PFSEQID]
        });
        return result[0]
    }
    async updatePlatformRequest(dbClient, oPlatformRequest, PFSEQID, user = "anonymous") {
        const sFields = Object.keys(oPlatformRequest).join(" = ? ,");
        const aParam = Object.values(oPlatformRequest);
        const query = `UPDATE T_PLATFORM_REQ_MASTER SET ${sFields} = ?, MODIFIED_BY = ?,MODIFIED_ON = CURRENT_TIMESTAMP WHERE PFSEQID = ?`;
        await dbClient.query(query, {
            replacements: [...aParam, user, PFSEQID]
        });
    }
    async getByEmailID(dbClient, emailID) {
        const query = `SELECT * FROM T_PLATFORM_REQ_MASTER WHERE EMAIL_ID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [emailID]
        });
        return result[0]
    }
    async addPlatformRequest(dbClient, body, user = "anonymous") {
        const sFields = Object.keys(body).join(",");
        const sParam = '?,'.repeat(Object.keys(body).length).slice(0, -1);
        const aParam = Object.values(body);
        const PFSEQID = uuidv4();
        const query = `INSERT INTO T_PLATFORM_REQ_MASTER (PFSEQID,${sFields}, CREATED_BY, CREATED_ON , MODIFIED_BY, MODIFIED_ON) 
        VALUES ('${PFSEQID}',${sParam}, ?,CURRENT_TIMESTAMP, ?,CURRENT_TIMESTAMP)`;
        await dbClient.query(query, {
            replacements: [...aParam, user, user]
        })
        return PFSEQID;
    }
    async executeAction(dbClient, body, user = "anonymous") {
        //TODO : Move validation part to controller
        const oPlatformRequest = await this.getPlatformRequest(dbClient, body.PFSEQID);
        if (!oPlatformRequest) {
            return {
                status_code: 400, response: { message: "Platform request is not present" }
            }
        }
        if (oPlatformRequest.STATUS === "SAVE") {
            return {
                status_code: 422, response: { message: "Only submitted Platform request can be approved or rejected" }
            }
        }
        if (oPlatformRequest.STATUS === "PFADMINAPPROVED" || oPlatformRequest.STATUS === "PFADMINREJECTED") {
            return {
                status_code: 422, response: { message: "Platform request is already approved or rejected" }
            }
        }
        if (body.ACTION === "APPROVE") {

            const RETSEQID = uuidv4();

            const query = `UPDATE T_PLATFORM_REQ_MASTER SET GENERATED_ID = ?, STATUS = ?, PF_ADMIN_REMARKS = ?, PF_ACTIONED_ON = current_timestamp ,
            PF_ACTIONED_BY = ?, MODIFIED_BY = ?,MODIFIED_ON = CURRENT_TIMESTAMP WHERE PFSEQID = ?`;
            await dbClient.query(query, {
                replacements: [RETSEQID, "PFADMINAPPROVED", body.REMARKS, user, user, body.PFSEQID]
            });

            ["PFSEQID", "REQ_TYPE", "TENANT_ID", "GENERATED_ID", "PRIMARY_CONTACT_NAME", "STATUS", "PF_ADMIN_REMARKS",
                "PF_ACTIONED_BY", "PF_ACTIONED_ON", "CREATED_BY", "CREATED_ON",
                "MODIFIED_BY", "MODIFIED_ON"].forEach(element => delete oPlatformRequest[element]);

            const COLUMN_NAMES = Object.keys(oPlatformRequest).join(",");
            const sParam = '?,'.repeat(Object.keys(oPlatformRequest).length).slice(0, -1);
            const aParam = Object.values(oPlatformRequest);
            const retailQuery = `INSERT INTO T_RETAIL_MASTER (RETSEQID,${COLUMN_NAMES},CREATED_BY, CREATED_ON , MODIFIED_BY, MODIFIED_ON) VALUES ('${RETSEQID}',${sParam}, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)`;
            await dbClient.query(retailQuery, {
                replacements: [...aParam, user, user]
            })


        } else if (body.ACTION === "REJECT") {
            const query = `UPDATE T_PLATFORM_REQ_MASTER SET  STATUS = ?, PF_ADMIN_REMARKS = ?, PF_ACTIONED_ON = current_timestamp ,
            PF_ACTIONED_BY = ?, MODIFIED_BY = ?,MODIFIED_ON = CURRENT_TIMESTAMP WHERE PFSEQID = ?`;
            await dbClient.query(query, {
                replacements: ["PFADMINREJECTED", body.REMARKS, user, user, body.PFSEQID]
            })
        }
        return {
            status_code: 204, response: undefined
        }
    }
}

module.exports = RetailerRepository
