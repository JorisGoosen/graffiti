
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
    // Get the canvas and context
    //var canvas = document.createElement('canvas');//
    var canvas                  = document.getElementById("kanvas"); 
    canvas.width                = 2048;
    canvas.height               = 2048;
    var context                 = canvas.getContext("2d");
    var imagedata               = context.createImageData(canvas.width, canvas.height);

    var achtergrondCanvas       = document.createElement('canvas');
    achtergrondCanvas.width     = canvas.width;
    achtergrondCanvas.height    = canvas.height;
    var achtergrondImg          = new Image();
    achtergrondImg.width        = canvas.width;
    achtergrondImg.height       = canvas.height;
    
    var Actxt = achtergrondCanvas.getContext("2d");

    var getekend = new Uint8Array(canvas.width * canvas.height * 4);

    function teken(x, y, rad)
    {

        
        //if(_imgData == null)
          //  return;

        _imgData    = imagedata.data;
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
                        _imgData[offset + i] = (_imgData[offset + i] * (1.0 - nieuwAlfa)) + (nieuwAlfa * deKleur[i]);
                    

                    _imgData[offset + 3] = Math.max(255, _imgData[offset + 3] + deKleur[3]);
                }
            }
    }

 

    var invalidated = true;

     
    function tekenHier(x, y)
    {
      teken(x, y, radius);
      invalidated = true;
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
    
    var acht = null;
    var paintBackground = true;

    achtergrondImg.onload       = function () 
    {
        console.log("tabula rasa loads!");  

        var ctxt = achtergrondCanvas.getContext("2d");
        ctxt.drawImage(this, 0, 0); 
        
        var achtergrondData = ctxt.getImageData(0, 0, achtergrondCanvas.width, achtergrondCanvas.height);
        acht                = new Uint8Array(achtergrondData.data.buffer);

        invalidated = true;
        paintBackground = true;
    
    };
    achtergrondImg.src = "/images/tabula_rasa.png";

    


    function renderFrame(offset) 
    {

        for (var x=0; x<canvas.width; x++) 
        {
            for (var y=0; y<canvas.height; y++) 
            {
                var pixelindex = (y * canvas.width + x) * 4;
 
                var rTkn    = getekend[pixelindex + 0];
                var gTkn    = getekend[pixelindex + 1];
                var bTkn    = getekend[pixelindex + 2];
                var aTkn    = getekend[pixelindex + 3];
                
                var rTR     = acht == null ? 128 : acht[pixelindex + 0];
                var gTR     = acht == null ? 128 : acht[pixelindex + 1];
                var bTR     = acht == null ? 128 : acht[pixelindex + 2];
                

                var mix     = aTkn / 255.0;

                var red     = (rTkn * mix) + (rTR * (1.0 - mix));
                var green   = (gTkn * mix) + (gTR * (1.0 - mix));
                var blue    = (bTkn * mix) + (bTR * (1.0 - mix));
 
                imagedata.data[pixelindex]      = red;   
                imagedata.data[pixelindex+1]    = green;
                imagedata.data[pixelindex+2]    = blue;
                imagedata.data[pixelindex+3]    = 256;
            }
        }   
    }
 
    // Main loop
    function loop(tframe) 
    {
         window.requestAnimationFrame(loop);
 
         if(invalidated)
         {
             if(paintBackground)
             {
                renderFrame(Math.floor(tframe / 10));
                paintBackground = false;

                kleurenKeuzeVullen();
             }
 
            context.putImageData(imagedata, 0, 0);

            invalidated = false;
         }
    }

    
 
    // Call the main loop
    loop(0);
};
