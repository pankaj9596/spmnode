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
    async getPlatformRequest(dbClient, PF_REQ_ID) {
        const query = `SELECT PF_REQ_ID,REQ_TYPE,TITLESEQID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,COMPANY_NAME,EMAIL_ID,ALT_EMAIL_ID,REGISTRATION_DATE,STORE_COUNT,EMP_COUNT,
        PH_COUNTRY_CODE,PHONE_NUMBER,ADDRESS_ID,ALT_PH_COUNTRY_CODE,ALT_PHN_NUMBER,WEBSITE,OWNERSHIP_TYPE,REMARKS,ADDITIONAL_INFO,
        BUSINESS_CODE,BUSINESS_DESC,CONCESSIONAIRE_SUPPORT,STORE_FORMAT,LOGO,HEADER_1,SUBHEADER_1,SUBHEADER_2,BACKGROUND_IMAGE,
        FAX_NUMBER,TELE_FAX_NUMBER,AUTH_TYPE,PRIMARY_CONTACT_NAME,STATUS FROM T_PLATFORM_REQ_MASTER WHERE PF_REQ_ID = ? AND ACTIVE = TRUE`;
        const [result] = await dbClient.query(query, {
            replacements: [PF_REQ_ID]
        });
        return result[0]
    }
    async updatePlatformRequest(dbClient, oPlatformRequest, PF_REQ_ID, user, transaction) {
        const sFields = Object.keys(oPlatformRequest).join(" = ? ,");
        const aParam = Object.values(oPlatformRequest);
        const query = `UPDATE T_PLATFORM_REQ_MASTER SET ${sFields} = ?, MODIFIED_BY = ?,MODIFIED_ON = CURRENT_TIMESTAMP WHERE PF_REQ_ID = ?`;
        let config = {
            replacements: [...aParam, user, PF_REQ_ID]
        };
        if (transaction) config.transaction = transaction;
        await dbClient.query(query, config);
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
        const PF_REQ_ID = uuidv4();
        const query = `INSERT INTO T_PLATFORM_REQ_MASTER (PF_REQ_ID,${sFields}, CREATED_BY, CREATED_ON , MODIFIED_BY, MODIFIED_ON) 
        VALUES ('${PF_REQ_ID}',${sParam}, ?,CURRENT_TIMESTAMP, ?,CURRENT_TIMESTAMP)`;
        await dbClient.query(query, {
            replacements: [...aParam, user, user]
        })
        return PF_REQ_ID;
    }
    async addRetailer(dbClient, oRetailer, user, transaction) {
        const RETAILER_ID = uuidv4();
        const sFields = Object.keys(oRetailer).join(",");
        const sParam = '?,'.repeat(Object.keys(oRetailer).length).slice(0, -1);
        const aParam = Object.values(oRetailer);
        const retailQuery = `INSERT INTO T_RETAIL_MASTER (RETAILER_ID,${sFields},CREATED_BY, CREATED_ON , MODIFIED_BY, MODIFIED_ON) VALUES ('${RETAILER_ID}',${sParam}, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)`;
        let config = {
            replacements: [...aParam, user, user]
        };
        if (transaction) config.transaction = transaction;
        await dbClient.query(retailQuery, config)
        return RETAILER_ID;
    }
}

module.exports = RetailerRepository
