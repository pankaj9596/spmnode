const SupplierRepository = require("./repository")
const controller = {
    getAllGuest: async (req, res, next) => {
        try {
            const supplierRepository = new SupplierRepository();
            const result = await supplierRepository.getAllGuest(req.db, req.query);
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    },
    registerGuest: async (req, res, next) => {

    }
}
module.exports = controller;