const Invoice = require("../models/Invoice");

exports.createInvoice = async (req, res) => {
  try {
    const user = req.user;

    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status
    } = req.body;

    // Basic validation
    if (!invoiceNumber || !items || items.length === 0) {
      return res.status(400).json({ message: "Invoice number and items are required" });
    }

    let subTotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const itemBaseTotal = item.quantity * item.unitPrice;
      const itemTax = (itemBaseTotal * (item.taxPercent || 0)) / 100;

      subTotal += itemBaseTotal;
      taxTotal += itemTax;

      // overwrite correct total per item
      item.total = itemBaseTotal + itemTax;
    });

    const total = subTotal + taxTotal;

    const invoice = await Invoice.create({
      user: user._id,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status,
      subTotal,
      taxTotal,
      total
    });

    res.status(201).json(invoice);

  } catch (error) {
    console.error("Create Invoice Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .populate("user", "username email businessName");



    res.status(200).json(invoices);
  } catch (error) {
    console.error("Get Invoices Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate("user", "username email");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);

  } catch (error) {
    console.error("Get Invoice By ID Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status
    } = req.body;

    // 1️⃣ Find invoice that belongs to logged-in user
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 2️⃣ Recalculate totals if items are updated
    let subTotal = 0;
    let taxTotal = 0;

    if (items && items.length > 0) {
      items.forEach(item => {
        const baseTotal = item.quantity * item.unitPrice;
        const tax = (baseTotal * (item.taxPercent || 0)) / 100;

        item.total = baseTotal + tax;

        subTotal += baseTotal;
        taxTotal += tax;
      });

      invoice.items = items;
      invoice.subTotal = subTotal;
      invoice.taxTotal = taxTotal;
      invoice.total = subTotal + taxTotal;
    }

    // 3️⃣ Update other fields (only if sent)
    invoice.invoiceNumber = invoiceNumber || invoice.invoiceNumber;
    invoice.invoiceDate = invoiceDate || invoice.invoiceDate;
    invoice.dueDate = dueDate || invoice.dueDate;
    invoice.billFrom = billFrom || invoice.billFrom;
    invoice.billTo = billTo || invoice.billTo;
    invoice.notes = notes || invoice.notes;
    invoice.paymentTerms = paymentTerms || invoice.paymentTerms;
    invoice.status = status || invoice.status;

    // 4️⃣ Save updated invoice
    const updatedInvoice = await invoice.save();

    res.status(200).json(updatedInvoice);

  } catch (error) {
    console.error("Update Invoice Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });

  } catch (error) {
    console.error("Delete Invoice Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



