// load mongoose

const mongoose = require("mongoose");

// connect
const url = 'mongodb://127.0.0.1:27017/kontak_db';
mongoose.connect(url)
        .catch(e => console.log(e));


// membuat schema
// const Contact = mongoose.model("Contact",{
//     nama : {
//         type : String,
//         required : true
//     },
//     nohp : {
//         type : String,
//         required : true
//     },
//     email : {
//         type : String,
//         required : true
//     }
// });

// mengisi satu data
// const addData = new Contact({
//     nama : "Diana Purba",
//     nohp : "082134561234",
//     email : "diana@gmail.com"
// });

// // simpan ke database
// addData.save().then( v => console.log(v));