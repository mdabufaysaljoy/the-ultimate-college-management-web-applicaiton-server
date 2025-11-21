const { Schema, model } = require("mongoose");

const StudentPayment = new Schema({
    email: String,
    month: String,
    paymentStatus: {
        type: String,
        default: 'due'
    },
    transectionId: String,
    amountPaid: Number,
    paidWith: String,
    storeAmount: Number,
    paymentDate: String,
    
})

module.exports = model('StudentPayment', StudentPayment);