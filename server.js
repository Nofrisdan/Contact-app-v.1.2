// require
const { json } = require("express");
const 
    express = require("express"),
    layout = require("express-ejs-layouts"),
    {body,validationResult,check} = require("express-validator"),
    session = require("express-session"),
    flash = require("connect-flash"),
    cookie = require("cookie-parser");
// const { Collection } = require("mongoose");


// mongoose
require("./database/db"); //tidak perlu dibuat variabel karna cuma menyimpan koneksi saja
const {Contact} = require("./model/Kontak");


// initialize
const app = express();
const port = 3000;

// configure
app.set("view engine","ejs");
app.use(layout);
app.set("layout","layout/layout");
app.use(cookie('secret'));

// setsession
app.use(session({
    cookie:{maxAge : 60000},
    secret : 'secret',
    resave : true,
    saveUninitialized :true
}));
// setflash
app.use(flash());

// static path
app.use("/bs4css",express.static("./public/bs4/css/"))
app.use("/bs4js",express.static("./public/bs4/js/"));


// body-parser
app.use(express.urlencoded({extended : true}));


// routes
app.get("/",(req,res) => {
    const data = {
        page : "Halaman Dashboard",
        menu : "dashboard"
    }

    res.render("index",data);
})

app.get("/about",(req,res) => {
    const data = {
        page : "Halaman About",
        menu : "about"
    }

    res.render("about",data);
})


app.get("/kontak",async (req,res) => {

    const Kontak = await Contact.find();
    const data = {
        page : "Halaman Kontak",
        menu : "kontak",
        data : Kontak,
        msg : req.flash("msg")
    } 

    // flash

    res.render("kontak",data);
})

app.get("/kontak/detail/:id", async (req,res) => {

    const data = {
        page : "Detail Kontak",
        menu : "kontak",
        kontak : await Contact.findOne({_id : req.params.id})
    }

    res.render("detail",data)
})

app.get("/kontak/tambah",(req, res) => {
    const data = {
        page : "Halaman Tambah Kontak",
        menu : "kontak"
    }

    res.render("form-tambah-kontak",data);
})


// tambah data 
//express-validator
const validation = [
    //custom
    body('nama').custom( async (v) => {
        const duplikat = await Contact.find({nama : v});

        if(duplikat.length != 0){
            throw new Error("Nama yang anda masukkan sudah terdaftar");
        }

        return true;
    }),

    // check automatic
    check("email").isEmail().withMessage("Email Yang Anda Masukkan Tidak Valid"),
    check("nohp").isMobilePhone("id-ID").withMessage("No HandPhone Yang anda masukkan tidak valid")
];


app.post("/kontak/tambah-data",validation,async (req,res) => {
    // handler-validator

    const error = validationResult(req);
    if(!error.isEmpty()){
        // rediret to form kontak
        const data = {
            page : "Halaman Tambah Data",
            menu : "kontak",
            errors : error.array()
        }

        res.render("form-tambah-kontak",data);

    }else{

        // insert
        const insert = await Contact.insertMany(req.body);
        if(insert){
            // flash
            req.flash("msg","Data Berhasil Ditambahkan");
            // redirect
            res.redirect("/kontak");
        } else{
            const data = {
                page : "Halaman Tambah Data",
                menu : "kontak",
                errors : error.array()
            }
    
            res.render("form-tambah-kontak",data);
        }
    }

    
})

app.get("/kontak/hapus/:id",async (req,res) => {

    const del = await Contact.deleteOne({_id : req.params.id});

    req.flash("msg","Berhasil Dihapus");

    res.redirect("/kontak");

} )


app.get("/kontak/edit/:id",async (req,res) => {

    const data_edit = await Contact.findOne({_id : req.params.id});

    const data = {
        page : "Halaman Ubah Kontak",
        menu : "kontak",
        data : data_edit
    }

    res.render("form-edit-data",data);

})
app.post("/kontak/edit",[
     // check automatic
     check("email").isEmail().withMessage("Email Yang Anda Masukkan Tidak Valid"),
     check("nohp").isMobilePhone("id-ID").withMessage("No HandPhone Yang anda masukkan tidak valid")
],async (req,res) => {

    // edit data 

    // handle
    const Valid = validationResult(req);

    if(!Valid.isEmpty()){
        const data = {
            page : "Halaman Ubah Data",
            menu : "kontak",
            errors : Valid.array(),
            data : req.body
        }

        res.render("form-edit-data",data);
    }else{
        const id = req.body.id;

        const data = {
            nama : req.body.nama,
            nohp : req.body.nohp,
            email : req.body.email
        }
    
        const update = await Contact.updateMany({_id : id},data);
    
        req.flash("msg",`Data Kontak Berhasil Diubah`);

        res.redirect("/kontak");
    }

   
})

// listen server
app.listen(port,() => {
    console.log(`Url active localhost:${port}`);
})