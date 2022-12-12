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
            const supplierRepository = new SupplierRepository();
            const commonRepository = new CommonRepository();
            if (req.body[0]["GSTREGSEQID"]) {
                const GSTREGSEQID = req.body[0]["GSTREGSEQID"];
                const oGuestRequest = await supplierRepository.getGuestEntry(req.db, GSTREGSEQID);
                if (!oGuestRequest) {
                    res.status(400).send({ message: "Guest Request is not present." });
                    return;
                }
                if (oGuestRequest.STATUS === "APPROVED" || oGuestRequest.STATUS === "REJECTED") {
                    res.status(422).send({ message: "Approved/Rejected Guest Request can not be modified" });
                    return;
                }
                delete req.body[0]["GSTREGSEQID"];
                const oAddress = req.body[0].ADDRESS[0];
                await commonRepository.updateAddress(req.db, oAddress, req.body[0]["ADDRESS_ID"]);
                delete req.body[0].ADDRESS;
                await supplierRepository.updateGuest(req.db, req.body[0], GSTREGSEQID, req.user);
                res.status(200).send({ GSTREGSEQID })
            } else {
                const emailID = req.body[0]["EMAIL_ID"];
                const resp = await supplierRepository.getByEmailID(req.db, emailID);
                if (resp?.length > 0) {
                    res.status(400).send({ message: `EMail ID: ${emailID} already exists` });
                    return;
                }
                const oAddress = req.body[0].ADDRESS[0];
                const ADDRESS_ID = await commonRepository.saveAddress(req.db, oAddress);
                req.body[0]["ADDRESS_ID"] = ADDRESS_ID;
                delete req.body[0].ADDRESS;
                const result = await supplierRepository.registerGuest(req.db, req.body[0], req.user);
                res.status(201).send({ GSTREGSEQID: result })
            }
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
    },
    executeAction: async (req, res, next) => {
        try {
            const body = req.body[0];
            if (!body.GSTREGSEQID || !body.ACTION) {
                res.status(400).send({ message: "Please send GSTREGSEQID and ACTION" });
                return;
            }
            if (body.ACTION !== "APPROVE" && body.ACTION !== "REJECT") {
                res.status(400).send({ message: "unknown action" });
                return;
            }
            const supplierRepository = new SupplierRepository();
            const oGuestRequest = await supplierRepository.getGuestEntry(req.db, body.GSTREGSEQID);
            if (!oGuestRequest) {
                res.status(400).send({ message: "Guest Request is not present." });
                return;
            }
            if (oGuestRequest.STATUS !== "SUBMIT") {
                res.status(422).send({ message: "Only Submitted Guest request can be approved or rejected" });
                return;
            }
            if (oGuestRequest.STATUS === "APPROVED" || oGuestRequest.STATUS === "REJECTED") {
                res.status(422).send({ message: "Guest Request is already approved or rejected" });
                return;
            }
            const user = req.User || "anonymous";
            const { status_code, response } = await supplierRepository.executeAction(req.db, body, user, oGuestRequest);
            res.status(status_code).send(response);
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    },
    getAllSupplier: async (req, res, next) => {
        try {
            const supplierRepository = new SupplierRepository();
            const result = await supplierRepository.getAllSupplier(req.db, req.query);
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    },
    updateSupplier: async (req, res, next) => {
        try {
            const oSupplier = req.body[0];
            const VENDMSTRSEQID = oSupplier.VENDMSTRSEQID;
            delete oSupplier.VENDMSTRSEQID;
            const supplierRepository = new SupplierRepository();
            const result = await supplierRepository.updateSupplier(req.db, oSupplier, VENDMSTRSEQID);
            res.status(204).send();
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    }
}
module.exports = controller;