const RetailerRepository = require("./repository")
const CommonRepository = require("../common/repository");
const uuidv4 = require("../../util/uuid")
// const Ajv = require("ajv")
// const ajv = new Ajv()
const controller = {
    registerRetailer: async (req, res, next) => {
        try {
            const action = req.query.action;
            if (action !== "save" && action !== "submit") {
                res.status(400).send({ message: "unknown action" });
                return;
            }
            req.body["STATUS"] = action.toUpperCase();
            const commonRepository = new CommonRepository();
            const retailerRepository = new RetailerRepository();
            if (req.body["PF_REQ_ID"]) {
                const PF_REQ_ID = req.body["PF_REQ_ID"];
                let oPlatformRequest = await retailerRepository.getPlatformRequest(req.db, PF_REQ_ID);
                if (!oPlatformRequest) {
                    res.status(400).send({ message: "Platform Request is not present." });
                    return;
                }
                if (oPlatformRequest.STATUS !== "SAVE") {
                    res.status(422).send({ message: "Submitted/Approved/Rejected Platform Request can not be modified" });
                    return;
                }
                const oAddress = req.body.ADDRESS[0];
                await commonRepository.updateAddress(req.db, oAddress, req.body["ADDRESS_ID"]);
                delete req.body.ADDRESS;
                delete req.body["PF_REQ_ID"];
                const result = await retailerRepository.updatePlatformRequest(req.db, req.body, PF_REQ_ID, req.user);
                req.body.ADDRESS = [oAddress];
                req.body.PF_REQ_ID = PF_REQ_ID;
                res.status(200).send(req.body)
            } else {
                const emailID = req.body["EMAIL_ID"];
                const resp = await retailerRepository.getByEmailID(req.db, emailID);
                if (resp?.length > 0) {
                    res.status(400).send({ message: `EMail ID: ${emailID} already exists` });
                    return;
                }
                const oAddress = req.body.ADDRESS[0];
                const ADDRESS_ID = await commonRepository.saveAddress(req.db, oAddress);
                req.body["ADDRESS_ID"] = ADDRESS_ID;
                delete req.body.ADDRESS;
                const PF_REQ_ID = await retailerRepository.addPlatformRequest(req.db, req.body, req.user);
                req.body.ADDRESS = [oAddress];
                req.body.PF_REQ_ID = PF_REQ_ID;
                res.status(201).send(req.body)
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    },
    getAllRequest: async (req, res, next) => {
        try {
            const retailerRepository = new RetailerRepository();
            const result = await retailerRepository.getAllRequest(req.db, req.query);
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    },
    validateEmail: async (req, res, next) => {
        try {
            const emailID = req.query.emailID;
            if (!emailID) {
                res.status(400).send({ message: "Please send emailID as request parameter" });
                return;
            }
            const retailerRepository = new RetailerRepository();
            const oPlatformRequest = await retailerRepository.getByEmailID(req.db, emailID);
            if (!oPlatformRequest) {
                res.status(200).send({ message: "EMail ID does not exists" });
                return;
            }
            const commonRepository = new CommonRepository();
            const oAddress = await commonRepository.getAddress(req.db, oPlatformRequest["ADDRESS_ID"]);
            oPlatformRequest["ADDRESS"] = [oAddress];
            res.status(409).send({ message: "EMail ID already exists", data: oPlatformRequest });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    },
    executeAction: async (req, res, next) => {
        const transaction = await req.db.transaction();
        try {
            const body = req.body[0];
            if (!body.PF_REQ_ID || !body.ACTION) {
                res.status(400).send({ message: "Please send PF_REQ_ID and ACTION" });
                return;
            }
            if (body.ACTION !== "APPROVE" && body.ACTION !== "REJECT") {
                res.status(400).send({ message: "unknown action" });
                return;
            }
            const retailerRepository = new RetailerRepository();
            const oPlatformRequest = await retailerRepository.getPlatformRequest(req.db, body.PF_REQ_ID);
            if (!oPlatformRequest) {
                res.status(400).send({ message: "Platform request is not present" });
                return;
            }
            if (oPlatformRequest.STATUS === "SAVE") {
                res.status(422).send({ message: "Only submitted Platform request can be approved or rejected" });
                return;
            }
            if (oPlatformRequest.STATUS === "PFADMINAPPROVED" || oPlatformRequest.STATUS === "PFADMINREJECTED") {
                res.status(422).send({ message: "Platform request is already approved or rejected" });
                return;
            }
            if (body.ACTION === "APPROVE") {
                ["PF_REQ_ID", "REQ_TYPE", "TENANT_ID", "GENERATED_ID", "PRIMARY_CONTACT_NAME", "STATUS", "PF_ADMIN_REMARKS",
                    "PF_ACTIONED_BY", "PF_ACTIONED_ON", "CREATED_BY", "CREATED_ON",
                    "MODIFIED_BY", "MODIFIED_ON"].forEach(element => delete oPlatformRequest[element]);
                const RETAILER_ID = await retailerRepository.addRetailer(req.db, oPlatformRequest, req.user, transaction);
                await retailerRepository.updatePlatformRequest(req.db,
                    {
                        "GENERATED_ID": RETAILER_ID,
                        "STATUS": "PFADMINAPPROVED",
                        "PF_ADMIN_REMARKS": body.REMARKS,
                        "PF_ACTIONED_ON": new Date(),
                        "PF_ACTIONED_BY": req.user
                    }, body.PF_REQ_ID, req.user, transaction);
                // const commonRepository = new CommonRepository();
                // await commonRepository.addUser(req.db, {
                //     RETAILER_ID,
                //     "OBJECT_ID": "",//TODO: Need to finalize
                //     "VALID_FROM": new Date(),
                //     "USER_ID": 1000000, //TODO: create DB sequence
                // }, transaction);
            } else {
                await retailerRepository.updatePlatformRequest(req.db,
                    {

                        "STATUS": "PFADMINREJECTED",
                        "PF_ADMIN_REMARKS": body.REMARKS,
                        "PF_ACTIONED_ON": new Date(),
                        "PF_ACTIONED_BY": req.user
                    }, body.PF_REQ_ID, req.user);
            }
            await transaction.commit();
            res.status(204).send();
        } catch (err) {
            console.log(err);
            await transaction.rollback();
            res.status(500).send(err.toString())
        }
    }
};
module.exports = controller