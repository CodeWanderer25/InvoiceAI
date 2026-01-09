const express = require("express");

const authProtect = require("../middlewares/AuthMiddleware");
const { InvoiceFromText, sendPaymentReminder, getDashboardSummary } = require("../controllers/GenAiController");

const router = express. Router() ;

router.post("/text", authProtect, InvoiceFromText);
router.post("/generate-reminder", authProtect, sendPaymentReminder);
router.get("/dashboard-summary", authProtect, getDashboardSummary);

module.exports = router;