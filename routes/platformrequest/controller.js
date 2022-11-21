const RetailerRepository = require("./repository")
const CommonRepository = require("../common/repository");
const Ajv = require("ajv")
const ajv = new Ajv()
const controller = {
    registerRetailer: async (req, res, next) => {
        try {
            const action = req.query.action;
            if (action !== "save" && action !== "submit") {
                res.status(400).send({ message: "unknown action" });
                return;
            }
            req.body["STATUS"] = action.toUpperCase();
            //TODO :check Email ID validation
            //Save address
            const commonRepository = new CommonRepository();
            const oAddress = req.body.ADDRESS[0];
            const ADDSEQID = await commonRepository.saveAddress(req.db, oAddress);
            req.body["ADDSEQID"] = ADDSEQID;
            delete req.body.ADDRESS;
            const retailerRepository = new RetailerRepository();
            const result = await retailerRepository.addPlatformRequest(req.db, req.body);
            res.status(201).send({ PFSEQID: result })
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
                res.status(400).send("Please send emailID as request parameter");
                return;
            }
            const retailerRepository = new RetailerRepository();
            const result = await retailerRepository.getByEmailID(req.db, emailID);
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
            // const schema = {
            //     type: "object",
            //     properties: {
            //         PFSEQID: { type: "string" },
            //         ACTION: { type: "string" },
            //         REMARKS: { type: "string" }
            //     },
            //     required: ["PFSEQID", "ACTION"],
            //     additionalProperties: false
            // }
            // const validate = ajv.compile(schema)
            // const valid = validate(body)
            // if (!valid) {
            //     res.status(400).send(validate.errors)
            // }


            if (!body.PFSEQID || !body.ACTION) {
                res.status(400).send({ message: "Please send PFSEQID and ACTION" });
                return;
            }
            if (body.ACTION !== "APPROVE" && body.ACTION !== "REJECT") {
                res.status(400).send({ message: "unknown action" });
                return;
            }
            const user = req.User || "anonymous";
            const retailerRepository = new RetailerRepository();
            const { status_code, response } = await retailerRepository.executeAction(req.db, body, user);
            res.status(status_code).send(response);
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }
    }
};
module.exports = controller