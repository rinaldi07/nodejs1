var express = require('express');
var app = express();
var logger = require('morgan'); // Berfungsi untuk memanggil module 'morgan' dan memasukkannya ke dalam variabel logger
var path = require ('path'); 
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');

var expressku = require('./routes/expressku') // Middleware 'expressku' berasal dari file 'expressku.js' yang di-include dan disimpan dalam variabel'expressku' ..
var adminku = require('./routes/adminku') //middleware 'adminku' berasal dari folder routes/adminku..

var conn = require('express-myconnection');
var mysql = require('mysql');

app.set('port', process.env.port || 3000); //setting port otomatis / 'setting port berdasarkan port environment pada app service yang berguna pada saaat proses deployment ke app service'
app.set('view engine', 'ejs');

app.use(logger('dev')); // Berfungsi untuk memuat fungsi middleware morgan pada object logger () dan setting report/log dalam format 'developer'
// app.use('/public', express.static(__dirname + '/public')) // untuk menampilkan template statis di localhost // sintaks app.use() berfungsi intuk memuat middleware agar dapat digunakan atau dieksekusi dengan syarat tertentu ,, middleware static() berfungsi untuk mengakses file statis di dalam folder '' dengan memasukkan '__dirname' dan nama folder..
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());

app.use(
    conn(mysql, {
        host:'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'express_db'
    }, 'single')
)

app.get('/', function(req, res) {
    res.send('Server is running on port ' + app.get('port')); // server is running => terdeteksi ke halaman google search
    // res.send('Server-nya udah running bosquh.. !!!');
});

app.use(
    session({
        secret: 'babastudio',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 120000}
    })
);

// berfungsi untuk route '/express' di handle oleh method home dari fungsi middleware yang telah di buat
app.get('/express', expressku.home); 
app.get('/express/news', expressku.news);
app.get('/express/news_detail/:id_news', expressku.news_detail); 
app.get('/express/about', expressku.about); 
app.get('/express/contact', expressku.contact); 
app.get('/express/gallery', expressku.gallery); 

//untuk form admin LTE
app.get('/express/admin', adminku.data);
app.get('/express/admin/login', adminku.login);
app.post('/express/admin/login', adminku.login);
app.get('/express/admin/home', adminku.data);
app.get('/express/admin/add_news', adminku.add_news);
app.post('/express/admin/add_news', adminku.process_add_news);
app.get('/express/admin/edit_news/:id_news', adminku.edit_news);
app.post('/express/admin/edit_news/:id_news', adminku.process_edit_news);
app.get('/express/admin/delete_news/:id_news', adminku.delete_news);
app.get('/express/admin/logout', adminku.logout);

app.listen(app.get('port'), function() {
    console.log('Server is running on port' + app.get('port'));
});



//MIDDLEWARE adalah perangkat lunak komputer yang menyediakan layanan untuk aplikasi perangkat lunak di luar yang tersedia dari sistem operasi. Hal ini dapat digambarkan sebagai "perangkat lunak lem". Middleware memudahkan pengembang perangkat lunak untuk melakukan komunikasi dan input / output, sehingga mereka dapat fokus pada tujuan khusus dari aplikasi mereka. Middleware adalah perangkat lunak yang menghubungkan komponen perangkat lunak atau aplikasi perusahaan. Middleware adalah lapisan perangkat lunak yang terletak di antara sistem operasi dan aplikasi pada setiap sisi jaringan komputer terdistribusi. Biasanya, mendukung kompleks, aplikasi bisnis perangkat lunak yang didistribusikan.


// 
// TUJUAN Perangkat MIDDLEWARE memiliki beberapa tujuan, diantaranya adalah :
// a.       Menyediakan fasilitas bagi programmer untuk dapat mendistribusikan objek yang digunakan pada beberapa proses yang berbeda.
// b.      Dapat berjalan dalam satu mesin ataupun di beberapa mesin yang terhubung dengan jaringan.
// jika boleh diperjelas, tujuan dari Middleware ialah sebagai interkoneksi interkoneksi beberapa aplikasi dan masalah interoperabilitas. Middleware sangat dibutuhkan untuk bermigrasi dari aplikasi mainframe ke aplikasi client/server dan juga untuk menyediakan komunikasi antar platform yang berbeda.
//   Manfaat Middleware
// Sebuah Abstraksi Middleware diciptakan sebagai perantara antara Sistem Operasi dengan Software Apliskasi yang terdistribusi pastinya memiliki manfaat yang besar :
// a.       2 buah platform/aplikasi dapat dijalankan secara bersamaan pada sistem yang terdistribusi
// b.      memungkinkan satu aplikasi berkomunikasi dengan lainnya walaupun berjalan pada platform yang berbeda
// c.       Transparansi di seluruh jaringan sehingga menyediakan interaksi dengan layanan atau aplikasi lain
// d.      Independen dari layanan jaringan
// e.       Handal dan selalu tersedia