const MasterRepository = require("./repository")
const getTitle = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getTitle(req.db);
    res.status(200).send(result)
}
const getOwnerShipList = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getOwnerShipList(req.db);
    res.status(200).send(result)
}
const getBusinessCode = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getBusinessCode(req.db);
    res.status(200).send(result)
}
const getStoreFormat = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getStoreFormat(req.db);
    res.status(200).send(result)
}
const getCountryCode = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getCountryCode(req.db);
    res.status(200).send(result)
}
const getState = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getState(req.db);
    res.status(200).send(result)
}
const getDepartment = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getDepartment(req.db);
    res.status(200).send(result);
};
const getSubDepartment = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getSubDepartment(req.db);
    res.status(200).send(result);
};
const getPaymentMethod = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getPaymentMethod(req.db);
    res.status(200).send(result);
};

const getAddressType = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getAddressType(req.db);
    res.status(200).send(result);
};

const getVendorType = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getVendorType(req.db);
    res.status(200).send(result);
};

const getEmpCountForStore = async (req, res, next) => {
    const masterRepository = new MasterRepository();
    const result = await masterRepository.getEmpCountForStore(req.db);
    res.status(200).send(result);
};

const getBatchData = async (req, res, next) => {
    const body = req.body;
    const mapping = {
        "TITLE": "getTitle",
        "BUSINESS-CODE": "getBusinessCode",
        "OWNERSHIP": "getOwnerShipList",
        "STORE-FORMAT": "getStoreFormat",
        "COUNTRY-CODE": "getCountryCode",
        "STATE": "getState",
        "DEPARTMENT": "getDepartment",
        "SUBDEPARTMENT": "getSubDepartment",
        "PAYMENT-METHOD": "getPaymentMethod",
        "ADDRESSTYPE": "getAddressType",
        "VENDORTYPE": "getVendorType",
        "EMP-COUNT-FOR-STORE": "getEmpCountForStore"
    }
    if (!body) {
        res.status(400).send("Please send object list");
        return;
    }
    const masterRepository = new MasterRepository();
    const promiseArr = body.map(element => {
        return masterRepository[mapping[element]](req.db);
    });
    const result = await Promise.all(promiseArr);
    let output = {};
    body.forEach((k, i) => { output[k] = result[i] })
    res.status(200).send(output);
}
module.exports = {
    getTitle, getOwnerShipList, getBusinessCode, getBatchData, getStoreFormat, getCountryCode, getState,
    getDepartment, getSubDepartment, getPaymentMethod, getAddressType, getVendorType, getEmpCountForStore,
}