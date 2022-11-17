const RetailerRepository = require("./repository")
const registerRetailer = async (req, res, next) => {
    const retailerRepository = new RetailerRepository();
    const result = await retailerRepository.addPlatformRequest(req.db, req.body);
    res.status(201).send(result)
}
const validateEmail = async (req, res, next) => {
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
}
module.exports = { registerRetailer, validateEmail }