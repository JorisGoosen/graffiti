var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


let multer = require('multer');
let upload = multer({limits: { fieldSize: 25 * 1024 * 1024 } });

let canvasnpm = require('canvas')
const canvas = canvasnpm.createCanvas(2048, 1024)
const ctx = canvas.getContext('2d')

var tabula = new canvasnpm.Image(2048, 1024);
tabula.onload = function(){
  ctx.drawImage(tabula,0,0);
}
tabula.src = "./public/images/drawn.png";

var lastId = -1;

router.post('/uploadDraw', upload.fields([]), (req, res) => {
  let formData = req.body;

  console.log("Got some image posted by id " + formData.id);//

  var img = new canvasnpm.Image(2048, 1024);

  img.onload = function(){
    ctx.drawImage(img,0,0); 

    var fs      = require('fs')
      , out     = fs.createWriteStream("./public/images/drawn.png")
      , stream  = canvas.pngStream({compressionLevel: 9});

    stream.on('data', function(chunk) { out.write(chunk); });
    stream.on('end',  function()      
    { 
      console.log('saved png and sending response with last ID: ' + lastId); 
      res.send(String(lastId));
      lastId = formData.id;
    });
  };
  img.src = formData.drawn;
  
});

module.exports = router;
