const MasterRepository = require("./repository")
const getTitle = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getTitle(req.db);
        res.status(200).send(result)
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
}
const getOwnerShipList = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getOwnerShipList(req.db);
        res.status(200).send(result)
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
}
const getBusinessCode = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getBusinessCode(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
}
const getStoreFormat = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getStoreFormat(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
}
const getCountryCode = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getCountryCode(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
}
const getState = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getState(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
}
const getDepartment = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getDepartment(req.db, req.query);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};
const getSubDepartment = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getSubDepartment(req.db, req.query);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};
const getPaymentMethod = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getPaymentMethod(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};

const getAddressType = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getAddressType(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};

const getVendorType = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getVendorType(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};

const getEmpCountForStore = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getEmpCountForStore(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};
const getContactType = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getContactType(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};

const getCreditPeriod = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getCreditPeriod(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};

const getShoppingConditions = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getShoppingConditions(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};

const getReconcilationAccountPicklist = async (req, res, next) => {
    try {
        const masterRepository = new MasterRepository();
        const result = await masterRepository.getReconcilationAccountPicklist(req.db);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
};
const getBatchData = async (req, res, next) => {
    try {
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
            "EMP-COUNT-FOR-STORE": "getEmpCountForStore",
            "CONTACT-TYPE": "getContactType",
            "CREDITPERIOD": "getCreditPeriod",
            "SHOPPINGCONDN": "getShoppingConditions",
            "RECONCACCNT": "getReconcilationAccountPicklist"
        }
        if (!Array.isArray(body)) {
            res.status(400).send({ message: "Please send object list in Array" });
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
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString())
    }
}
module.exports = {
    getTitle, getOwnerShipList, getBusinessCode, getBatchData, getStoreFormat, getCountryCode, getState,
    getDepartment, getSubDepartment, getPaymentMethod, getAddressType, getVendorType, getEmpCountForStore, getContactType,
    getCreditPeriod, getShoppingConditions, getReconcilationAccountPicklist
}