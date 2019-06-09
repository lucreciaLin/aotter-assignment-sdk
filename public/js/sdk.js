const dataList = [];
const dataListForSpa = [];

function getData(_type, _adGroupId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            dataList.push(JSON.parse(this.responseText));
            makeDom(dataList, _adGroupId);
        }
    };
    xhttp.open("GET", "http://0.0.0.0:3000/database/ads?type=" + _type, true);
    xhttp.send();
}

function makeDom(_list, _adGroupId) {
    var aryLen = _list.length;
    for (var i = 0; i < aryLen; i++) {
        var ad = _list[i];
        formElems(ad, _adGroupId);
    }
}

function formElems(_ad, _adGroupId) {
    var adGroup = document.getElementById(_adGroupId);
    var ad = document.createElement('div');
    ad.setAttribute('id', _ad.id);
    adGroup.appendChild(ad);
    
    var titleElem = document.createElement('span');
    ad.appendChild(titleElem);
    var titleTxt = document.createTextNode(_ad.title);
    titleElem.appendChild(titleTxt);
    
    var figure = document.createElement('figure');
    ad.appendChild(figure);
    
    var img = document.createElement('img');
    figure.appendChild(img);
    img.setAttribute('src', _ad.image);
}

function getWhichList(_adLoadingMode) {
    if (_adLoadingMode == 'auto') {
        return dataList;
    } else {
        return dataListForSpa;
    }
}

function onAdLoaded(_adLoadingMode) {
    var successList = [];
    var list = getWhichList(_adLoadingMode);
    var aryLen = list.length;
    for (var i = 0; i < aryLen; i++) {
        var ad = list[i];
        if (ad.success == true) {
            successList.push(ad.id);
        }
    }
    if (successList.length > 0) {
        console.log('ad id: ', successList,' 載入成功。');
    }
}

function onAdFailed(_adLoadingMode) {
    var failureList = [];
    var list = getWhichList(_adLoadingMode);
    var aryLen = list.length;
    for (var i = 0; i < aryLen; i++) {
        var ad = list[i];
        if (ad.success == false) {
            failureList.push(ad.id);
        }
    }
    if (failureList.length > 0) {
        console.log('ad id: ', failureList, ' 載入失敗。');
    }
}

function onAdImpression(_adLoadingMode) {
    var halfScreenSize = window.innerWidth * window.innerHeight * 0.5;
    var list = getWhichList(_adLoadingMode);
    var aryLen = list.length;
    for (var i = 0; i < aryLen; i++) {
        var ad = list[i];
        var adElem = document.getElementById(ad.id);
        var adSize = adElem.offsetWidth * adElem.offsetHeight;
        if (adSize > halfScreenSize) {
            setTimeout(function(){
                console.log('開始呼叫 impression_url');
                callImpressionUrl(ad.impression_url);
            }, 1000);
        } else {
            console.log('未能呼叫 impression_url');
        }
    }
}

function callImpressionUrl(_impressionUrl) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('完成呼叫 impression_url');
        }
    };
    xhttp.open("GET", _impressionUrl, true);
    xhttp.withCredentials = true;
    xhttp.send();
}

function renderAdInSPA(_type, _adGroupId) {
    document.getElementById(_adGroupId),
    showSpaZone = function (){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange=function() {
            if (this.readyState == 4 && this.status == 200) {
                dataListForSpa.push(JSON.parse(this.responseText));
                makeDom(dataListForSpa, _adGroupId);
            }
        };
        xhttp.open("GET", "http://0.0.0.0:3000/database/ads?type=" + _type, true);
        xhttp.send();
    };
    document.addEventListener("DOMContentLoaded", function(event) {
        window.requestAnimationFrame(showSpaZone);
    });
}
