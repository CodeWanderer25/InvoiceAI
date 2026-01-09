const mongoose = require("mongoose") ;

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },

    quantity: { type: Number, required: true },

    unitPrice: { type: Number, required: true },

    taxPercent: { type: Number, default: 0 },

    total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    invoiceNumber:{
        type:String,
        required:true
    },
    invoiceDate:{
        type:Date,
        default:Date.now
    },
    dueDate:{
        type:Date
    },
    billFrom:{
        businessName: String,
        email:String,
        address: String,
        phoneNumber: String
    },
    billTo:{
        clientName: String,
        email:String,
        address: String,
        phoneNumber: String

    },
    items: [itemSchema],
    notes:{
        type: String
    },
    paymentTerms:{
        type: String,
        default:"net"
    },
    status:{
        type:String,
        enum:["Paid" , "UnPaid"],
        default: "UnPaid"
    },
    subTotal:Number,
    taxTotal:Number,
    total:Number

} , {timestamps:true})

module.exports = mongoose.model("Invoice" , invoiceSchema);