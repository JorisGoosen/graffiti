/*var _imgW       = 2048;
var _imgH       = 2048;
var _imgData    = null;


function zetDoelImageData(imgData, width, height)
{
    _imgData    = imgData;
    _imgW       = width;
    _imgH       = height;
};

function zetDoelNodeJsData(imgData, width, height)
{
    _imgData    = imgData;
    _imgW       = width;
    _imgH       = height;
};

function teken(x, y, rad, r, g, b)
{
    if(_imgData == null)
        return;

    for(var xd = -rad; xd < rad; xd++)
        for(var yd = -rad; yd < rad; yd++)
            if(x + xd >= 0 && x + xd < _imgW && y + yd >= 0 && y + yd < _imgH)
            {
                _imgData[x + xd + ((y + yd) * _imgW) + 0] = r;
                _imgData[x + xd + ((y + yd) * _imgW) + 1] = g;
                _imgData[x + xd + ((y + yd) * _imgW) + 2] = b;
            }
}

*/