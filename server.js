var express = require('express');
var multer  = require('multer');
var fs  = require('fs'); 
var noBots = require('express-nobots');

var app = express();
app.set('view engine', 'ejs');
var dir = './uploads';



var serveIndex = require('serve-index')
 
app.use('/uploads', express.static('uploads'), serveIndex('uploads', {'icons': true}))




app.get('/secure', (req, res) => {
    if(req.query.data!==undefined && req.query.key!==undefined )
    {
        var text=req.query.data
        var key=req.query.key
 
        var result='';
 
        var crypto = require('crypto');  
        var algorithm = 'aes256';   

        if(req.query.decrypt !==undefined)
        {
            
            var decipher = crypto.createDecipher(algorithm, key);
            var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
            result=decrypted;
        }
        else
        {

            var cipher = crypto.createCipher(algorithm, key);  
            var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
            result=encrypted;
        }

 

        res.render('code',{result:result});

    }
    else
    res.render('code',{result:''});

});
 


app.get('/', (req, res) => {
    res.render('index');
});


app.get('/delete', (req, res) => {
   
    
    if(!req.query.delete)
    {
        res.send(405)
        return
    }

    var path=dir+'/'+req.query.delete
    if (fs.existsSync(path)) {

        fs.unlinkSync(path);
        res.send({message:"File Deleted",file:path});

    }
    else
    {
        res.send({message:"File does not exists"});
    }


});





var storage = multer.diskStorage({
    destination: function (req, file, callback) {
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
