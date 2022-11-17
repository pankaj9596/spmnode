class RetailerRepository {
    constructor() {

    }
    async getByEmailID(dbClient, emailID) {
        const query = `SELECT * FROM T_PLATFORM_REQ_MASTER WHERE EMAIL_ID = ?`;
        const [result] = await dbClient.query(query, {
            replacements: [emailID]
        });
        return result
    }
    async addPlatformRequest(dbClient, body) {

        //save Addresss, get ID save it in AddressID



        const COLUMN_NAMES = Object.keys(body).join(",");
        const length = Object.keys(body).length;
        const sParam = '?,'.repeat(length).slice(0, -1);
        const COLUMN_VALUES = Object.values(body);
        console.log(COLUMN_VALUES);
        const query = `INSERT INTO T_PLATFORM_REQ_MASTER (${COLUMN_NAMES}) VALUES (${sParam})`;
        const [result] = await dbClient.query(query, {
            replacements: COLUMN_VALUES
        })
        return result
    }

}

module.exports = RetailerRepository
