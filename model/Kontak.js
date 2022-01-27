const mongoose = require("mongoose");


// schema Contact
const Contact = mongoose.model("Contact",{
    nama : {
        type : String,
        required : true
    },
    nohp : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    }
});


// exports
module.exports = {
    Contact
} 