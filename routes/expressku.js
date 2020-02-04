exports.home = function(req, res) { // method 'home' berfungsi untuk merender template 'home.js' ketika di panggil ..
    req.getConnection(function (err, connect) {
        var query = connect.query('SELECT * FROM news_tbl LIMIT 6', function (err, rows) {
            if (err) {
                console.log('Error message: %', err);
            }

            res.render('home', {
                page_title: 'Express News',
                data:   rows
            });
        });
    });
    
}

exports.news = function(req, res) { // method 'home' berfungsi untuk merender template 'news.js' ketika di panggil ..
req.getConnection(function (err, connect) {
    var query = connect.query('SELECT * FROM news_tbl ', function (err, rows) {
        if (err) {
            console.log('Error message: %', err);
        }

        res.render('news', {
            page_title: 'Express News - News',
            data:   rows
        });
    });
    // fungsi query di atas adalah untuk menampilkan news yang dari database
});
// res.render('news');
}

exports.news_detail = function(req, res) {
    var id_news = req.params.id_news
    req.getConnection(function (err, connect) {
        var query = connect.query('SELECT * FROM news_tbl WHERE id_news=? ', id_news, function (err, rows) {
            if (err) {
                console.log('Error message: %', err);
            }
    
            res.render('news_detail', {
                page_title: 'Express News - News Detail',
                data:   rows
            });
        });
    });
    // res.render('news_detail');
}

exports.about = function(req, res) { // method 'home' berfungsi untuk merender template 'about.js' ketika di panggil ..
    res.render('about');
}

exports.contact = function(req, res) { // method 'home' berfungsi untuk merender template 'contact.js' ketika di panggil ..
    res.render('contact');
}

exports.gallery = function(req, res) { // method 'home' berfungsi untuk merender template 'gallery.js' ketika di panggil ..
    res.render('gallery');
}