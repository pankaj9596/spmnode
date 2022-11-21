const SupplierRepository = require("./repository");
const CommonRepository = require("../common/repository");
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
        try {
            //TODO :check Email ID validation
            //Save address
            const commonRepository = new CommonRepository();
            const oAddress = req.body[0].ADDRESS[0];
            const ADDSEQID = await commonRepository.saveAddress(req.db, oAddress);
            req.body[0]["ADDSEQID"] = ADDSEQID;
            delete req.body[0].ADDRESS;
            const supplierRepository = new SupplierRepository();
            const result = await supplierRepository.registerGuest(req.db, req.body[0], req.user);
            res.status(201).send({ GSTREGSEQID: result })
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    },
    validateEmail: async (req, res, next) => {
        try {
            const emailID = req.query.emailID;
            //TODO : EMAIL format validation
            if (!emailID) {
                res.status(400).send({ message: "Please send emailID as request parameter" });
                return;
            }
            const supplierRepository = new SupplierRepository();
            const result = await supplierRepository.getByEmailID(req.db, emailID);
            if (!result || result.length < 1) {
                res.status(200).send({ message: "EMail ID does not exists" });
                return;
            }
            res.status(400).send({ message: "EMail ID already exists", data: result });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    }
}
module.exports = controller;