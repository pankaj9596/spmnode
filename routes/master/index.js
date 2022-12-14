const express = require("express");
const controller = require("./controller");
const router = express.Router();
router.get("/title", controller.getTitle);
router.get("/ownership", controller.getOwnerShipList);
router.get("/business-code", controller.getBusinessCode);
router.get("/store-format", controller.getStoreFormat);
router.get("/country-code", controller.getCountryCode);
router.get("/state", controller.getState);
router.post("/batch", controller.getBatchData);
router.get("/department", controller.getDepartment);
router.get("/subdepartment", controller.getSubDepartment);
router.get("/payment-method", controller.getPaymentMethod);
router.get("/addresstype", controller.getAddressType);
router.get("/vendortype", controller.getVendorType);
router.get("/emp-count-for-store", controller.getEmpCountForStore);
router.get("/contacttype", controller.getContactType);
router.get("/creditperiod", controller.getCreditPeriod);
router.get("/reconcilation-account-picklist", controller.getReconcilationAccountPicklist);
router.get("/shopping-conditions", controller.getShoppingConditions);
module.exports = router;