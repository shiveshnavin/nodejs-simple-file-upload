var express = require('express');
var multer  = require('multer');
var fs  = require('fs'); 
var noBots = require('express-nobots');

var app = express();
app.set('view engine', 'ejs');
 


var serveIndex = require('serve-index')
 
app.use('/uploads', express.static('uploads'), serveIndex('uploads', {'icons': true}))




app.get('/', (req, res) => {
    res.render('index');
});


app.get('/delete', (req, res) => {
   
    
    if(!req.query.delete)
    {
        res.send(405)
        return
    }

    var path=req.query.delete
    if (fs.existsSync(path)) {

        fs.unlinkSync(filePath);
        res.send({message:"File Deleted",file:path});

    }
    else
    {
        res.send({message:"File does not exists"});
    }


});





var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage}).array('files', 12);
app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        res.redirect('/uploads?key='); 
    });
})
 
app.listen(3000);
