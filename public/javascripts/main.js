
   function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
      x: Math.floor((evt.clientX - rect.left) * scaleX),   // scale mouse coordinates after they have
      y: Math.floor((evt.clientY - rect.top) * scaleY)    // been adjusted to be relative to element
    }
  }

var deKleur = [255, 0, 0, 64];
var radius = 48;

function kleurenKeuzeVullen()
{
    var kleurkes = document.getElementById("kleuren"); 
    var kW = 2048;
    var kH = 128;
    
    //kleurkes.width = kW;
    kW = kleurkes.width;
    kleurkes.height= kH;

    var zoVaak = 1;//(kW - (kW % kH)) / kH;

    var kleurCtxt   = kleurkes.getContext("2d");
    var kleurData   = kleurCtxt.createImageData(kW, kH);

    var baseOffset = 3;
    var offsets = [baseOffset * Math.random(), baseOffset * Math.random(), baseOffset * Math.random()];

    var baseMult = 0.1;
    var minMult = 0.1;
    var mults = [minMult + (baseMult * Math.random()), minMult + (baseMult * Math.random()), minMult + (baseMult * Math.random())];

    for(var x=0; x<kW; x++)
        for(var y=0; y<kH; y++)
        {
            var offset = (x + (y * kW)) * 4;
            //var val = (255 / zoVaak) * (x / kH);
            var sinR = (x * 3.14 * mults[0]) + offsets[0];
            var sinG = (x * 3.14 * mults[1]) + offsets[1];
            var sinB = (x * 3.14 * mults[2]) + offsets[2];

            kleurData.data[offset + 0] = 128 + (Math.sin(sinR) * 128);
            kleurData.data[offset + 1] = 128 + (Math.sin(sinG) * 128);
            kleurData.data[offset + 2] = 128 + (Math.sin(sinB) * 128);
            kleurData.data[offset + 3] = (y / kH) * 255;

        }

    kleurCtxt.putImageData(kleurData, 0, 0);



    function muisKlik(click) 
    {
        var muis = getMousePos(kleurkes, click);
     //   var offset = (muis.x + (muis.y * kW)) * 4;

        var kd = kleurCtxt.getImageData(muis.x, muis.y, 1, 1);

        for(var i=0; i<4; i++)
            deKleur[i] = kd.data[i];

      //  console.log("deKleur: " +deKleur[0]+", "+deKleur[1]+", "+deKleur[2]+", "+deKleur[3]);

     // radius = 10 + (10 * deKleur[3] / 255);
    }

   document.getElementById("kleuren").onclick = muisKlik;
}



// The function gets called when the window is fully loaded
//window.onload = function()
function main()
{
    
    kleurenKeuzeVullen(); 
    //load actual canvas on screen into canvas
    var canvas                  = document.getElementById("kanvas"); 
    canvas.width                = 2048;
    canvas.height               = 1024;
    var context                 = canvas.getContext("2d");
    var imagedata               = context.createImageData(canvas.width, canvas.height);

    //create canvas for loading background aka previous view into
    var achtergrondCanvas       = document.createElement('canvas');
    achtergrondCanvas.width     = canvas.width;
    achtergrondCanvas.height    = canvas.height;
    
    
    //create empty canvas for uploading to server
    var uploadCanvas = document.createElement("canvas");
    uploadCanvas.width = canvas.width;
    uploadCanvas.height = canvas.height;
    var uploadImgData = uploadCanvas.getContext("2d").createImageData(uploadCanvas.width, uploadCanvas.height);

    function teken(x, y, rad)
    {
        _imgData    = uploadImgData.data;
        _imgW       = canvas.width;
        _imgH       = canvas.height;

        for(var xd = -rad; xd < rad; xd++)
            for(var yd = -rad; yd < rad; yd++)
            {
                var dist = Math.sqrt((xd * xd) + (yd * yd));
                if(dist <= rad &&  x + xd >= 0 && x + xd < _imgW && y + yd >= 0 && y + yd < _imgH)
                {
                    var offset = (x + xd + ((y + yd) * _imgW)) * 4;
                    var nieuwAlfa = (deKleur[3] / 255.0) * ((rad - dist) / rad) ;

                    for(var i=0; i < 3; i++)
                        _imgData[offset + i] = (imagedata.data[offset + i] * (1.0 - nieuwAlfa)) + (nieuwAlfa * deKleur[i]);
                        
                    _imgData[offset + 3] = Math.max(255, imagedata.data[offset + 3] + deKleur[3]);

                    for(var i=0; i < 4; i++)
                        imagedata.data[offset + i] = _imgData[offset + i];
                }
            }
    }

    var invalidated = true;
    var ietsGetekend = false;
     
    function tekenHier(x, y)
    {
      teken(x, y, radius);
      invalidated = true;
      ietsGetekend = true;
    }

    function muisKlik(click) 
    {
        var muis = getMousePos(canvas, click);
        tekenHier(muis.x, muis.y);
    }

    var down = false;

    function muisBeweeg(beweeg) 
    {
        if(down)
        {
            var muis = getMousePos(canvas, beweeg);
            tekenHier(muis.x, muis.y);
            invalidated = true;
        }
    };

    function muisBeneden() { down = true; }

    function muisOmhoog() { down = false; }
    
   function muisWiel(wiel)
   {
        radius = Math.max(0, Math.min(100, radius + wiel.deltaY));
   }

   document.getElementById("kanvas").onclick = muisKlik;
   document.getElementById("kanvas").onmousemove = muisBeweeg;
   document.getElementById("kanvas").onmousedown = muisBeneden;
   document.getElementById("kanvas").onmouseup = muisOmhoog;
   document.getElementById("kanvas").onmousewheel = muisWiel;

    var paintBackground = true;
    var achtergrondImg  = null;

    function loadBackground()
    {
        paintBackground = false;    

        achtergrondImg          = new Image();
        achtergrondImg.width        = canvas.width;
        achtergrondImg.height       = canvas.height;

        achtergrondImg.onload       = function () 
        {
            let Actxt = achtergrondCanvas.getContext("2d");
            Actxt.drawImage(this, 0, 0); 
            
            var achtergrondData = Actxt.getImageData(0, 0, achtergrondCanvas.width, achtergrondCanvas.height);

            invalidated = true;

            for (let pixelindex=0; pixelindex < canvas.width * canvas.height * 4; pixelindex += 4)
                for(let i=0; i<4; i++)
                        imagedata.data[pixelindex + i] = achtergrondData.data[pixelindex + i];


            
        };
        achtergrondImg.src = "/images/drawn.png";

        
    }

    var myRandomIdentication = Math.random();

    function uploadCurrentDrawing()
    {
        if(!ietsGetekend)
            return;

        ietsGetekend = false;
    
        let dataUri = uploadCanvas.toDataURL("png");

        let data = new FormData();
        data.append('drawn', dataUri);
        data.append('id', myRandomIdentication);

        const Http = new XMLHttpRequest();
        const url = "http://localhost:3000/uploadDraw";
        Http.open("POST", url, true);
        
        Http.send(data);

        for(var i=0; i<canvas.width * canvas.heigth * 4; i++)
            uploadImgData.data[i] = 0;

        Http.onreadystatechange=(e)=>{
          //  if(Http.responseText !== myRandomIdentication)
            //    paintBackground = true;
            console.log("response from server: " + Http.responseText);
        }
    }
 
    var deLaatsteTijdMS = performance.now();
    kleurenKeuzeVullen();

    // Main loop
    function loop(tframe) 
    {
         window.requestAnimationFrame(loop);
 
         if(invalidated)
         {
            canvas.getContext("2d").putImageData(imagedata, 0, 0);
            invalidated = false;
         }

         if(paintBackground)
                loadBackground();

         if(tframe - 10000 > deLaatsteTijdMS && !down)
         {
             deLaatsteTijdMS = tframe;

             uploadCanvas.getContext("2d").putImageData(uploadImgData, 0, 0);
             uploadCurrentDrawing();
         }
    }

    
 
    // Call the main loop
    loop(0);
};
