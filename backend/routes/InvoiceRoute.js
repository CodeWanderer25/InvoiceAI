const express = require("express");
const {
createInvoice,
getInvoices,
getInvoiceById,
updateInvoice,
deleteInvoice,
} = require("../controllers/invoiceController.js");
const authProtect = require("../middlewares/AuthMiddleware");


const router = express.Router();

router.post('/create', authProtect, createInvoice);
router.get('/get-invoices', authProtect, getInvoices);

router.get('/get-invoice/:id', authProtect, getInvoiceById);
router.put('/update/:id', authProtect, updateInvoice);
router.delete('/:id', authProtect, deleteInvoice);

module.exports = router;
