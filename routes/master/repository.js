const { createFilter } = require('odata-v4-mysql');
class MasterRepository {
    constructor() {

    }
    async getTitle(dbClient) {
        const query = 'select * from T_NAME_TITLE';
        const [result] = await dbClient.query(query)
        return result
    }
    async getOwnerShipList(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'OWNSHIP' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getBusinessCode(dbClient) {
        const query = "SELECT * FROM T_BUSINESS ORDER BY BUS_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getStoreFormat(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'STOREFMT' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getCountryCode(dbClient) {
        const query = "SELECT COUNTRY_CODE,COUNTRY_NAME FROM T_COUNTRY WHERE ACTIVE = TRUE";
        const [result] = await dbClient.query(query)
        return result
    }
    async getState(dbClient) {
        const query = "SELECT STATE_CODE,STATE_NAME,COUNTRY_CODE,STATE_DESC  FROM T_STATE WHERE ACTIVE = TRUE";
        const [result] = await dbClient.query(query)
        return result
    }
    async getDepartment(dbClient, queryParam) {
        let query = "SELECT DEPSEQID,DEPT_CODE,DEPT_DESC FROM T_DEPARTMENT WHERE ACTIVE = TRUE AND VALID_TO > CURRENT_TIMESTAMP", aParam = [];
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
    async getSubDepartment(dbClient, queryParam) {
        let query = "SELECT SUBDEPSEQID,DEPSEQID,SUB_DEPT_CODE,SUB_DEPT_DESC  FROM T_SUB_DEPARTMENT WHERE ACTIVE = TRUE AND VALID_TO > CURRENT_TIMESTAMP", aParam = [];
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
    async getPaymentMethod(dbClient) {
        const query = "SELECT PAYMENT_ID, PAYMENT_CODE, LABEL_CODE, CODE_DESC FROM T_PAYMENT WHERE ACTIVE = TRUE AND VALID_TO > CURRENT_TIMESTAMP";
        const [result] = await dbClient.query(query)
        return result
    }
    async getAddressType(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'ADRTYPE' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getVendorType(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'VENDTYPE' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getEmpCountForStore(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'EMPCNT' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getContactType(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'CONTACTTYPE' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getCreditPeriod(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'CREDITPERIOD' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getShoppingConditions(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'SHOPCONDITIONS' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
    async getReconcilationAccountPicklist(dbClient) {
        const query = "SELECT * FROM T_OBJECT_MASTER WHERE OBJECT_TYPE = 'RECONCACCOUNTS' AND VALID_TO > CURRENT_TIMESTAMP ORDER BY OBJECT_CODE ASC";
        const [result] = await dbClient.query(query)
        return result
    }
}

module.exports = MasterRepository
