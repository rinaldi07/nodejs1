var multer = require ('multer')

exports.login = function (req, res) {
    var message = '';
    var sess = req.session;
    var md5 = require('md5');

    if(req.method == 'POST') { 
        //  jika route method pada route adalah POST. Jalankan proses autentikasi login.

        // 1. tangkaplah nilai dari atribut pada element body pada template 'index.ejs'.
        var post = req.body;

        // 2. tangkaplah nilai atribut name dari form input username da password sebagai berikut.

         // tampilkan nilai atribut name dari form input username dan password
        var name = post.username;
        // var pass = post.password;

        var pass = md5(post.password); //fungsi md5() berasal dari variabel md5 yang berisi objek dari modul md5

        // 3. lakukan koneksi dan query data admin
        req.getConnection(function(err, connect){

            var sql = "SELECT id_admin, username, name, admin_level FROM admin_tbl WHERE username='"+name+"' AND password='"+pass+"'";
            var query = connect.query(sql, function(err, results){
                if (results.length) {
                    // jika hasil query ada, maka daftarkan session dan alihkan ke halaman home admin di dalam sintaks if pada baris ke 19 !
                    req.session.adminId     = results[0].id_admin;
                    req.session.admin       = results[0];
                    console.log(results[0].id_admin); // log yang di tampilkan fungsi console.log() tersebut merujuk pada hasil query dat base yaitu nilai id_admin pada tabel 'admin_tbl' !
                    res.redirect('./home'); // fungsi res.redirect() berfungsi untuk mengalihkan halaman ke route '/home' yang merender tampilan dashboard admin
                } else {
                    // sedangkan jika hasil query tidak ada, kirimkan pesan eror dan tamilkan layout login !
                    message = 'Username or password incorrect ! Please try again.';
                    res.render('./admin/index', {
                        message: message,
                        // sql: sql // untuk menampilkan pesan error pada box admin login
                    });
                }
            }); 
        });
    }else {
        //  jika route nethod nya bukan POST. maka tampilkan layout form login.

        res.render('./admin/index', {
            message: message
        });
    }
}

exports.data = function(req, res){
    var admin = req.session.admin;
    var adminId = req.session.adminId;
    //console.log('id_admin=' + adminId);

    if(adminId == null){
        res.redirect('/express/admin/login');
        return;
    }
    req.getConnection(function(err, connect){
        var sql= "SELECT * FROM news_tbl ORDER BY createdate DESC";
        var query = connect.query(sql, function(err, results){

            //jika koneksi dan query berhasil, tampilkan home admin pada browers. !
            // panggil data
            res.render('./admin/data', {
                pathname: 'data',
                data: results
            });
        });
    });
    
}

exports.add_news = function(req, res) { 
    var admin = req.session.admin;
    var adminId = req.session.adminId;
    console.log('id_admin=' + adminId);

    if (adminId == null) {
        res.redirect('/express/admin/login');
        return;
    }
    res.render('./admin/data', {
        pathname: 'add_news'
    });
}

exports.process_add_news = function (req, res) {
    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage: storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err) {
        if (err) {
            return res.end('Error uploading image !');
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            // tangkaplah nilai atau value atribut name dari tag body sebagai berikut !
            var post = {
                title: req.body.title,
                description: req.body.description,
                images: req.file.filename,
                createdate: date
            }

            console.log(post);  //berfungsi untuk menampilkan data post pada konsole node.js command prompt !

            var sql = "INSERT INTO news_tbl SET ?"; // variabel 'news_tbl' berasal dari database !

             //variabel sql parameter connect.query(), variable post sebagai parameter masukan untuk fungsi connect.query().
            var query = connect.query(sql, post, function(err, results) {
                if (err) {
                    console.log('error input news: %s', err);
                }
                
                req.flash('info', 'Succcess add data! Data has been updated.');
                res.redirect('/express/admin/home');
            });
        });
    });
}

exports.edit_news = function(req, res) {
    var admin = req.session.admin;
    var adminId = req.session.adminId;
    console.log('id_admin=' + adminId);

    if (adminId == null) {
        res.redirect('/express/admin/login');
        return;
    }

    // variabel id_news tersebut berfungsi untuk menangkap nilai dari parameter id_news yang berasal dari link atau tombol edit !
    var id_news = req.params.id_news;

    req.getConnection(function(err, connect) {
        var sql = "SELECT * FROM news_tbl WHERE id_news=?";

        var query = connect.query(sql, id_news, function(err, results) {
            if (err) {
                console.log('ERROR show news: %s', err);
            }

            res.render('./admin/data', {
                id_news: 'id_news',
                pathname: 'edit_news',
                data: results
            });

        });
    });
}

exports.process_edit_news = function(req, res) {
    var id_news = req.params.id_news;

    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage: storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err) {
        if (err) {
            var image = req.body.image_old;
            console.log("ERROR uploading image !");
        } else if (req.file == undefined) {
            var image = req.body.image_old;
        } else {
            var image = req.file.filename;
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            var post = {
                title: req.body.title,
                description: req.body.description,
                images: req.file.filename,
                createdate: date
            }

             var sql = " UPDATE news_tbl SET ? WHERE id_news=?";
            
             var query = connect.query(sql, [post, id_news], function(err, results) {
                if (err) {
                     console.log("Error edit news: %s", err);
                }
                req.flash('info', 'Success edit data! Data has been updated.');
                res.redirect('/express/admin/home')
            });
        });
    });
}

exports.delete_news = function (req, res) {
    var id_news = req.params.id_news;

    req.getConnection(function(err, connect) {
        var sql = "DELETE FROM news_tbl WHERE id_news=?";

        var query = connect.query(sql, id_news, function(err, results) {
            if (err) {
                console.log('Error delete news: %s', err);
            }

            res.redirect('/express/admin/home')
        });
    });
}

exports.logout = function (req, res) {
    req.session.destroy(function(err) {
        res.redirect('/express/admin/login');
    });
}