const RetailerRepository = require("./repository")
const controller = {
    registerRetailer: async (req, res, next) => {
        try {
            const action = req.query.action;
            const retailerRepository = new RetailerRepository();
            switch (action) {
                case "save":
                    req.body["STATUS"] = "SAVE";
                    //TODO check Email ID validation
                    const saveResult = await retailerRepository.addPlatformRequest(req.db, req.body);
                    res.status(201).send({ PFSEQID: saveResult })
                    break;
                case "submit":
                    req.body["STATUS"] = "SUBMIT";
                    //TODO check Email ID validation
                    const result = await retailerRepository.addPlatformRequest(req.db, req.body);
                    res.status(201).send({ PFSEQID: result })
                    break;
                default:
                    res.status(400).send({ message: "Unknown action" });
                    break;
            }

        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString())
        }

    },
    getAllRequest: async (req, res, next) => {
        const retailerRepository = new RetailerRepository();
        const result = await retailerRepository.getAllRequest(req.db, req.query);
        res.status(200).send(result)
    },
    validateEmail: async (req, res, next) => {
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
        res.status(400).send({ message: "EMail ID already exists", data: result })
    },
    executeAction: async (req, res, next) => {
        try {
            const body = req.body[0];
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