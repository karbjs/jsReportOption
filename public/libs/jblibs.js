var express = require('express');
let ini = require("ini");
var fs = require('fs');
var path = require('path');
///let pptxgen = require("pptxgenjs");

var Libs = {
    capitalizeStr: function(str){
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    toLowerKeys: function(obj){
        return Object.keys(obj).reduce((accumulator, key) => {
            accumulator[key.toLowerCase()] = obj[key];
            return accumulator;
        }, {});
    },
    getLang: function($lang, $key){
        //console.log($key);
        for (var key in $lang) {
            if ($key.toLocaleLowerCase().indexOf(key.toLocaleLowerCase())!==-1) {
                return $lang[key].ko+" - "+$lang[key].vi;
            }
        }
        return  $key;
    },
    slideProcessData: function(pptx, mName, mType ="", mSize="", loadProcess) {
        var slide = pptx.addSlide();
    
        var labelOption = { x: "5%", y: "15%", w: '90%', h: 1.42, align: 'center', fontFace: "Tahoma", fill: { color: "#0c0054", transparency: 30 }};
        var txtLabel = mName;
        if(mType!==""){
            txtLabel+=" ("+mType+")";
        }
        if(mSize!==""){
            txtLabel+=" - "+mSize;
        }
        txtLabel += "\nProcess";
        slide.addText(
            [
                { text: txtLabel, 
                    options: { fontSize: 32, bold: true, color: "#efff00", breakLine: true } 
                },
            ],
            labelOption
        );
    
        var subOption = { x: "5%", y: "42%", w: 1.4, h: 0.37, align: 'center', fontSize: 12, bold: true, color: "#bebebe", fontFace: "Tahoma", line:{ pt:'2', color:'A9A9A9' }};
        slide.addText("Process", subOption );
        
        var contentOption = { x: "10%", y: "60%", w: '80%', h: 0.5, align: 'left', fontFace: "Tahoma"};
        var textSlide = [];

        for(var i = 0; i < loadProcess.length; i++){
            var item = loadProcess[i];
            //console.log(loadProcess.length,loadProcess);
            if(item.toString().trim().toLocaleLowerCase()==="memory") item = this.capitalizeStr(item);
            textSlide[i] = { text: item.trim(), options: { fontSize: 20, bold: true, color: pptx.SchemeColor.accent1, breakLine: true , bullet:{code:'25A0'}} };
        }

        slide.addText(
            textSlide,
            contentOption
        );
    },
    slideTitleData: function(pptx, mName, mType ="", mSize="", Proc="", isLabel=false) {
        var slide = pptx.addSlide();
    
        var labelOption = { x: "5%", y: "15%", w: '90%', h: 1.42, align: 'center', fontFace: "Tahoma", fill: { color: "#0c0054", transparency: 30 }};
        var txtLabel = mName;
        if(!isLabel){
            if(mType!==""){
                txtLabel+=" ("+mType+")";
            }
            if(mSize!==""){
                txtLabel+=" - "+mSize;
            }
            if(Proc.toLocaleLowerCase()==="memory") Proc = this.capitalizeStr(Proc);
            txtLabel += "\nProcess "+Proc;
        }
        slide.addText(
            [
                { text: txtLabel, 
                    options: { fontSize: 32, bold: true, color: "#efff00", breakLine: true } 
                },
            ],
            labelOption
        );
    
    },
    slideTitleCompareData: function(pptx, iMain="", iSub="", Proc="") {
        var slide = pptx.addSlide();
    
        var labelOption = { x: "5%", y: "15%", w: '90%', h: 1.42, align: 'center', fontFace: "Tahoma", fill: { color: "#0c0054", transparency: 30 }};
        var txtLabel = iMain+" <==> "+iSub+ "\n"+Proc;
        slide.addText(
            [
                { text: txtLabel, 
                    options: { fontSize: 32, bold: true, color: "#efff00", breakLine: true } 
                },
            ],
            labelOption
        );
    
    },
    slideisMainData: function(pptx, imgData, imgNum) {
        var slide = pptx.addSlide();
        //Title Slide
        var titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
        var header = "Screen test machine";
        slide.addText(
            [
                { text: header.toUpperCase(), 
                    options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                },
            ],
            titleOption
        );

        var imgOption = { path: path.resolve(__dirname,imgData.M), x: 1, y: 1, w: 8, h: 4, rotate: 0 };
        if(imgNum===2){
            var s1Option = { x: 0.35, y: 0.5, w: 3, h: 0.36, align: 'left', fontFace: "Tahoma"};
            slide.addText(
                [
                    { text: "Inspection", 
                        options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#0c0054", breakLine: true } 
                    },
                ],
                s1Option
            );
            var s2Option = { x: 3.85, y: 0.5, w: 5.8, h: 0.36, align: 'left', fontFace: "Tahoma"};
            slide.addText(
                [
                    { text: "Screen Test", 
                        options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#0c0054", breakLine: true } 
                    },
                ],
                s2Option
            );
            
            imgOption = { path: path.resolve(__dirname,imgData.O), x: 0.35, y: 0.9, w: 3, h: 4.3, rotate: 0 }
            slide.addImage(imgOption);
            imgOption = { path: path.resolve(__dirname,imgData.M), x: 3.85, y: 0.9, w: 5.8, h: 4.3, rotate: 0 }
            slide.addImage(imgOption);
        }else{
            slide.addImage(imgOption);
        }
        //console.log(imgOption);
    },
    slideisSPowerData: function(pptx, imgData, imgNum) {
        var slide = pptx.addSlide();
        //Title Slide
        var titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
        var header = "Video & Power Config";
        slide.addText(
            [
                { text: header.toUpperCase(), 
                    options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                },
            ],
            titleOption
        );

        var imgOption = { path: imgData.P, x: 1, y: 1, w: 8, h: 4, rotate: 0 };
        if(imgNum===2){
            var s1Option = { x: 0.35, y: 0.5, w: 4.5, h: 0.36, align: 'left', fontFace: "Tahoma"};
            slide.addText(
                [
                    { text: "Video Config", 
                        options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#0c0054", breakLine: true } 
                    },
                ],
                s1Option
            );
            var s2Option = { x: 5.1, y: 0.5, w: 4.5, h: 0.36, align: 'left', fontFace: "Tahoma"};
            slide.addText(
                [
                    { text: "Power Config", 
                        options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#0c0054", breakLine: true } 
                    },
                ],
                s2Option
            );
            imgOption = { path: path.resolve(__dirname,imgData.S), x: 0.35, y: 0.9, w: 4.5, h: 4.3, rotate: 0 }
            slide.addImage(imgOption);
            imgOption = { path: path.resolve(__dirname,imgData.P), x: 5.1, y: 0.9, w: 4.5, h: 4.3, rotate: 0 }
            slide.addImage(imgOption);
        }else{
            if(imgData.S !== undefined){ imgOption = { path: path.resolve(__dirname,imgData.S), x: 1, y: 1, w: 8, h: 4, rotate: 0 }; }
            else if(imgData.P !== undefined){ imgOption = { path: path.resolve(__dirname,imgData.P), x: 1, y: 1, w: 8, h: 4, rotate: 0 }; }
            slide.addImage(imgOption);
        }
        
    },
    slideOtpSetUpData: function(pptx, sPath) {
        var slide = pptx.addSlide();
        //Title Slide
        var titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
        slide.addText(
            [
                { text: "Information Setup".toUpperCase(), 
                    options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                },
            ],
            titleOption
        );

        var s1Option = { x: 0.35, y: 0.5, w: 3, h: 0.36, align: 'left', fontFace: "Tahoma"};
        slide.addText(
            [
                { text: "IL", 
                    options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#0c0054", breakLine: true } 
                },
            ],
            s1Option
        );
        var s2Option = { x: 3.85, y: 0.5, w: 5.8, h: 0.36, align: 'left', fontFace: "Tahoma"};
        slide.addText(
            [
                { text: "MasterCal Value", 
                    options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#0c0054", breakLine: true } 
                },
            ],
            s2Option
        );
        
        // Spec Images
        var imgOption = { path: path.resolve( __dirname ,"../sources/IL.jpg"), x: 0.35, y: 0.9, w: 3, h: 4.3, rotate: 0 }
        slide.addImage(imgOption);
        imgOption = { path: path.resolve(__dirname,sPath+"MT.jpg"), x: 3.85, y: 0.9, w: 5.8, h: 4.3, rotate: 0 }
        slide.addImage(imgOption);
    },
    slideSpecData: function(pptx, header, imgData, imgNum, isCompare = 0) {
        // Spec Images
        if (parseInt(imgNum) > 0) {
            var slide = pptx.addSlide();
            //Title Slide
            var titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
            if (header !== "") {
                slide.addText(
                    [
                        { text: header.toString().toUpperCase(), 
                            options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                        },
                    ],
                    titleOption
                );
            }
            var sub = 0;
            if(isCompare==0){
                for(var st = 0; st < parseInt(imgNum); st += 4){
                    if(st !== 0){
                        //console.log(imgData);
                        var slidex = pptx.addSlide();
                        //Title Slide
                        titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
                        if (header !== "") {
                            slidex.addText(
                                [
                                    { text: (header+" (sub"+sub+")").toUpperCase(), 
                                        options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                                    },
                                ],
                                titleOption
                            );
                        }
                        this.loadPageImages(slidex, imgData, imgNum, st);
                    }else{
                        this.loadPageImages(slide, imgData, imgNum, st);
                    }
                    sub ++;
                }
            }else{
                for(var st = 0; st < parseInt(imgNum); st += 2){
                    if(st !== 0){
                        //console.log(st);
                        var slidex = pptx.addSlide();
                        //Title Slide
                        titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
                        if (header !== "") {
                            slidex.addText(
                                [
                                    { text: (header+" (sub"+sub+")").toUpperCase(), 
                                        options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                                    },
                                ],
                                titleOption
                            );
                        }
                        this.loadPageImages(slidex, imgData, imgNum, st, isCompare);
                    }else{
                        this.loadPageImages(slide, imgData, imgNum, st, isCompare);
                    }
                    sub ++;
                }
            }
            
        }
    },
    slideCompareData: function(pptx, header, iMain, imgMData, iSub, imgSData) {
        // Spec Images
        var slide = pptx.addSlide();
        //Title Slide
        var titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
        if (header !== "") {
            slide.addText(
                [
                    { text: header.toUpperCase(), 
                        options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                    },
                ],
                titleOption
            );
        }

        //Main Image
        var sMOption = { x: 0.35, y: 0.5, w: 4.5, h: 0.36, align: 'left', fontFace: "Tahoma"};
        slide.addText(
            [
                { text: iMain.toUpperCase(), 
                    options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#ffffff", breakLine: true } 
                },
            ],
            sMOption
        );
        if(imgMData!=""){
            var imgMOption = { path: path.resolve(__dirname,imgMData), x: 0.35, y: 0.9, w: 4.5, h: 4.3, rotate: 0 }
            slide.addImage(imgMOption);
        }

        //Sub Image
        var sSOption = { x: 5.15, y: 0.5, w: 4.5, h: 0.36, align: 'left', fontFace: "Tahoma"};
        slide.addText(
            [
                { text: iSub.toUpperCase(), 
                    options: { fontSize: 11, bold: true, bullet: { code: "002D"}, color: "#ffffff", breakLine: true } 
                },
            ],
            sSOption
        );
        if(imgSData!=""){
            var imgSOption = { path: path.resolve(__dirname,imgSData), x: 5.15, y: 0.9, w: 4.5, h: 4.3, rotate: 0 }
            slide.addImage(imgSOption);
        }
        
        
    },
    slideWaitSetting: function(pptx, header) {
        var slide = pptx.addSlide();
        //Title Slide
        var titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
        if (header !== "") {
            slide.addText(
                [
                    { text: header.toString().toUpperCase(), 
                        options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                    },
                ],
                titleOption
            );
        }
        //Title Slide
        titleOption = { x: "1%", y: "20%", w: '98%', h: 1.42, align: 'center', fontFace: "Tahoma", fill: { color: "#0c0054", transparency: 30 }};
        slide.addText(
            [
                { text: "Image is Empty Or Can't Capture".toUpperCase(), 
                    options: { fontSize: 32, bold: true, color: "#e74c3c", breakLine: true } 
                },
            ],
            titleOption
        );
    },
    slideEndData: function(pptx, mName="", mType ="", mSize="", isDisplay=true) {
        if(isDisplay){
            var slide = pptx.addSlide();
            if(mName!=""){
                var titleOption = { x: "5px", y: "5px", w: '55%', h: 0.5, align: 'left', fontFace: "Tahoma"};
                var txtLabel = "Module " + mName;
                if(mType!=""){
                    txtLabel+=" "+mType+"";
                }
                if(mSize!=""){
                    txtLabel+=" - "+mSize;
                }
                slide.addText(
                    [
                        { text: txtLabel.toUpperCase(), 
                            options: { fontSize: 12, bold: true, bullet: { code: "2605"}, color: "#0c0054", breakLine: true } 
                        },
                    ],
                    titleOption
                );
            }
            
            // Text Center
            var TextOption = { x: "20%", y: "35%", w: 5.85, h: 1.79, align: 'center', fontFace: "Malgun Gothic"};
            var strText = "The End";
            slide.addText(
                [
                    { text: strText.toUpperCase(), 
                        options: { fontSize: 80, bold: true, color: "#0c0054", breakLine: true } 
                    },
                ],
                TextOption
            );
    
            var sTextOption = { x: "55%", y: "70%", w: 3, h: 0.66, align: 'center', fontFace: "Malgun Gothic"};
            var strsText = "Thanks For Watching!";
            slide.addText(
                [
                    { text: strsText.toUpperCase(), 
                        options: { fontSize: 16, bold: true, color: "#0c0054", breakLine: true } 
                    },
                ],
                sTextOption
            );
        }
    },
    loadPageImages : function(slide, imgData, imgNum, st = 0){

        var imgOption = { path: "", x: 1, y: 1, w: 8, h: 4, rotate: 0 }
        var rx = 0,i = 0;
        if (parseInt(imgNum) === (1 + st)){
            imgOption.path = path.resolve(__dirname,imgData[0 + st]);
            slide.addImage(imgOption);
        }else if (parseInt(imgNum) === (2 + st)){
            rx = 0;    
            for (i = (0 + st); i < (2 + st); i++) {
                imgOption = { path: path.resolve(__dirname,imgData[i]), x: 1, y: 1, w: 8, h: 4, rotate: 0 }
                //console.log(imgOption);
                imgOption.w = imgOption.w / 2;
                imgOption.x = imgOption.x + (rx * imgOption.w);
                slide.addImage(imgOption);
                rx ++;
            }
        }else if (parseInt(imgNum) === (3 + st)){
            rx = 0; 
            for (i = (0 + st); i < (3 + st); i++) {
                imgOption = { path: path.resolve(__dirname,imgData[i]), x: 1, y: 1, w: 8, h: 4, rotate: 0 }
                imgOption.w = imgOption.w / 2;
                if (rx < 2) {
                    imgOption.x = imgOption.x + (rx * imgOption.w);
                } else {
                    imgOption.x = imgOption.x + imgOption.w;
                }
    
                if (rx !== 0) {
                    imgOption.h = imgOption.h / 2;
                    imgOption.y = imgOption.y + ((rx - 1) * imgOption.h);
                }
                slide.addImage(imgOption);
                rx ++;
            }
        }else if (parseInt(imgNum) === (4 + st) || parseInt(imgNum) > 4){
            rx = 0; 
            for (i = (0 + st); i < (4 + st); i++) {
                imgOption = { path: path.resolve(__dirname,imgData[i]), x: 1, y: 1, w: 4, h: 2, rotate: 0 }
                if (rx === 1) {
                    imgOption.x = imgOption.x + imgOption.w;
                } else if (rx === 2) {
                    imgOption.y = imgOption.y + imgOption.h;
                } else if (rx === 3) {
                    imgOption.x = imgOption.x + imgOption.w;
                    imgOption.y = imgOption.y + imgOption.h;
                }
                slide.addImage(imgOption);
                rx ++;
            }
        }
    },
    getDataOption: function(gModel, gProcess){
        var path_config = './public/sources/'+gModel+'/setup.ini';
        var iInfo = ini.parse(fs.readFileSync(path_config, 'utf-8'));
        
        const iType = (iInfo.Info.Type !== undefined) ? iInfo.Info.Type : "Single";
        const iName = (iInfo.Info.ModelName !== undefined) ? iInfo.Info.ModelName : "Development";
        const iSize = (iInfo.Info.Size !== undefined) ? iInfo.Info.Size : "10M";
        var dOptions = {iName:iName, iType:iType, iSize: iSize, cProcess : 0};

        var iProcess = (iInfo.Info.Process !== undefined) ? iInfo.Info.Process.split(', ') : [];
        var lProcess = [];
        for(var i=0; i< iProcess.length; i++){
            var sPro = iProcess[i], iImages = {}, kImages = [];
            var isAllProces = (gProcess=="" && iInfo[sPro].isMain==1);
            var isExtProces = (gProcess=="ext" && sPro.toLocaleLowerCase()!="compare" && iInfo[sPro].isMain==0);
            if( isAllProces || isExtProces || gProcess ==sPro){
                //console.log(iInfo[sPro].isMain);
                lProcess[dOptions.cProcess] = sPro;
                dOptions.cProcess ++;
                
                var iCCFN = (iInfo[sPro] !== undefined && iInfo[sPro].CCFN !== undefined)? iInfo[sPro].CCFN : "";
                var iPath = './public/sources/'+gModel+'/'+sPro+'/';

                //var iInfoProcess = ini.parse(fs.readFileSync(iPath+iCCFN, 'utf-8'));
                // console.log(iCCFN);
                // console.log(isMedia);
                
                kImages= fs.readFileSync(iPath+"listImage.txt", 'utf-8').replace(/\r\n/g, " ").trim().split(" ")
                //console.log(iImage);
                var listIndex = {}, DIdex = [], iCount = 1, crIdex = "";
                for(var m=0; m< kImages.length; m++){
                    var img = kImages[m];
                    var cimg  = img.toLocaleLowerCase().split('.jpg')[0].toUpperCase();
                    var cIdex = cimg.split('_'), dIdex = cimg.split('.'), vdIdex = "";

                    if(cIdex.length === 2){  vdIdex = cIdex[0];
                    }else if(dIdex.length === 2){ vdIdex = dIdex[0];
                    }else{ vdIdex = cimg;}

                    if(crIdex!==vdIdex){
                        DIdex = []; iCount = 0; 
                    }
                    crIdex = vdIdex; 

                    if(cIdex.length === 2){ 
                        DIdex.push(img);
                        iCount++;
                    }else if(dIdex.length === 2){
                        DIdex.push(img);
                        iCount++;
                    }else{
                        iCount = 1; 
                        DIdex = [img];
                    }
                    listIndex[vdIdex] = {iCount, DIdex};
                }
                iImages = listIndex;

                var oDatas = this.callDataOptions(iPath, iCCFN, sPro);
                dOptions[sPro]= oDatas.dProcess;
                dOptions[sPro+"_IMG"]= iImages;
                dOptions[sPro+"_DLL"]= oDatas.dDll;
                //console.log(iImages,dataProcess);
            }
        }
        
        //console.log(lProcess.length, lProcess);
        dOptions.lProcess = lProcess;
        return dOptions;
    },
    getDataCompare: function(gModel, gProcess){
        var path_config = './public/sources/'+gModel+'/setup.ini';
        var iInfo = ini.parse(fs.readFileSync(path_config, 'utf-8'));
        var iInfoCompare = (iInfo.COMPARE !== undefined)? iInfo.COMPARE : {};

        var both = iInfoCompare.Both.split(", ");
        var mBoth = iInfoCompare.Main;
        var careProcess = iInfoCompare.Process;
        var dOptions = {"iMain": mBoth, "iSub": "", cProcess: 0};
        var lProcess = [];
        for(var ari in careProcess){
            var sPro = careProcess[ari];
            lProcess[dOptions.cProcess] = sPro;
            dOptions.cProcess++;
            var iCCFN = (iInfoCompare.labs[sPro] !== undefined)? iInfoCompare.labs[sPro]: "";
            var iPath = './public/sources/'+gModel+'/COMPARE/'+mBoth+'/'+sPro+'/';
            
            for(var bri in both){
                var compare = both[bri];
                if(mBoth===compare || dOptions.iSub==="" || dOptions.iSub===compare){
                    if(mBoth!==compare) dOptions.iSub = compare;
                    iPath = './public/sources/'+gModel+'/COMPARE/'+compare+'/'+sPro+'/';
                    var iImages = {};
                    var kImages = fs.readFileSync(iPath+"listImage.txt", 'utf-8').replace(/\r\n/g, " ").trim().split(" ");
                    
                    var listIndex = {}, DIdex = [], iCount = 1, crIdex = "";
                    for(var m=0; m< kImages.length; m++){
                        var img = kImages[m];
                        
                        var cimg  = img.toLocaleLowerCase().split('.jpg')[0].toUpperCase();
                        var cIdex = cimg.split('_'), dIdex = cimg.split('.'), vdIdex = "";

                        if(cIdex.length === 2){  vdIdex = cIdex[0];
                        }else if(dIdex.length === 2){ vdIdex = dIdex[0];
                        }else{ vdIdex = cimg;}

                        if(crIdex!==vdIdex){
                            DIdex = []; iCount = 0; 
                        }
                        crIdex = vdIdex; 

                        if(cIdex.length === 2){ 
                            DIdex.push(img);
                            iCount++;
                        }else if(dIdex.length === 2){
                            DIdex.push(img);
                            iCount++;
                        }else{
                            iCount = 1; 
                            DIdex = [img];
                        }
                        listIndex[vdIdex] = {iCount, DIdex};
                        //console.log(vdIdex, listIndex);
                    }
                    iImages = listIndex;
                    dOptions[compare+"_"+sPro+"_IMG"]= iImages;
                }
            }
            iPath = './public/sources/'+gModel+'/COMPARE/'+dOptions.iSub+'/'+sPro+'/';
            var oDataSub = this.callDataOptions(iPath, iCCFN, sPro);
            dOptions[sPro+"_SUB"]= oDataSub.dProcess;

            iPath = './public/sources/'+gModel+'/COMPARE/'+dOptions.iMain+'/'+sPro+'/';
            var oDataMain = this.callDataOptions(iPath, iCCFN, sPro);
            dOptions[sPro]= oDataMain.dProcess;
        }

        
        //console.log(iImages,dataProcess);
        //console.log(lProcess.length, lProcess);
        dOptions.lProcess = lProcess;
        return dOptions;
    },
    callDataOptions: function (iPath, iCCFN, sPro){
        //console.log(iPath+iCCFN);
        var dataProcess = {"isMedia": 1}; dataDll = {};
        if(iPath!="" && iCCFN!="" && sPro!=""){
            var iInfoProcess = ini.parse(fs.readFileSync(iPath+iCCFN, 'utf-8'));
            var isMedia = (iCCFN.toLocaleLowerCase()==="DllManager.ini".toLocaleLowerCase()) ? 0 : 1;
            if(isMedia===1){
                var loadOptions = (iInfoProcess.Inspections.Load !== undefined) ? iInfoProcess.Inspections.Load.split(',') : [];
                iInfoProcess = this.toLowerKeys(iInfoProcess);
                var iPCount = 0;
                loadOptions.forEach(nItem => {
                if(nItem!=undefined){
                    var item = nItem.toLocaleLowerCase();
                    if(iInfoProcess[item].EnableInspection !== undefined && iInfoProcess[item].EnableInspection==="TRUE"){
                        iPCount ++;
                        dataProcess[iPCount]= nItem;
                        dataDll[iPCount]= iInfoProcess[item].Library;
                    }
                }
                });
            }else{
                var iaCount = 0, iaCCount=0, isSame = 1, iZSite =0, iCSize = 0;
                Object.keys(iInfoProcess).forEach(key => {
                    var vitem = iInfoProcess[key];
                    iZSite ++;
                    if(parseInt(vitem.HVS_DLL_LOAD.Count) > 0){
                        var ipCount = parseInt(vitem.HVS_DLL_LOAD.Count);
                        var icCount = 0;
                        for (const [i, item] of Object.values(vitem.HVS_DLL_LOAD).entries()) {
                            icCount++;
                            if(item==="0,0,"){
                                ipCount--;
                            }
                        }
                        if(iaCount!==ipCount){
                            if(iaCount!==0) isSame = 0;
                            iaCount = ipCount;
                            iCSize++;
                        }else if(iaCCount!==icCount){
                            if(iaCCount!==0) isSame = 0;
                            iaCCount = icCount;
                            iCSize++;
                        }
                    }
                    if(iZSite!==iCSize) isSame = 0;

                    dataProcess = {"isMedia": 0}; dataDll = {}; var eOption = [], eDll = [];

                    if(iInfoProcess["C"]!==undefined && iInfoProcess["D"]!==undefined && ((iInfoProcess["A"].HVS_DLL_LOAD.Count === iInfoProcess["B"].HVS_DLL_LOAD.Count &&
                        iInfoProcess["A"].HVS_DLL_LOAD.Count === iInfoProcess["C"].HVS_DLL_LOAD.Count &&
                        iInfoProcess["A"].HVS_DLL_LOAD.Count === iInfoProcess["D"].HVS_DLL_LOAD.Count) || isSame === 1)){
                        //console.log(iInfoProcess);
                        dataProcess = {"isMedia": 2}; dataDll = {}; eOption = []; eDll = [];
                        //console.log(iProcess);
                        for (var [i, item] of Object.values(iInfoProcess["A"].HVS_DLL_LOAD).entries()) {
                            if(i!=="Count" && parseInt(i) < parseInt(iInfoProcess["A"].HVS_DLL_LOAD.Count)){
                                var dllText = item.split(",");
                                //console.log(i);
                                if(parseInt(dllText[1])===1){
                                    item = dllText[0];
                                    eDll.push(item);
                                    item = item.slice(0, -4);
                                    eOption.push(item);
                                }
                                
                            }
                        }
                        dataProcess["A"]= eOption;
                        dataDll["A"]= eDll;

                        if(sPro.toUpperCase() === "DUAL" || sPro.toUpperCase() === "DUALCAL"){
                            eOption = []; eDll = [];
                            for (var [i, item] of Object.values(iInfoProcess["B"].HVS_DLL_LOAD).entries()) {
                                if(i!=="Count" && parseInt(i) < parseInt(iInfoProcess["B"].HVS_DLL_LOAD.Count)){
                                    var dllText = item.split(",");
                                    //console.log(i);
                                    if(parseInt(dllText[1])===1){
                                        item = dllText[0];
                                        eDll.push(item);
                                        item = item.slice(0, -4);
                                        eOption.push(item);
                                    }
                                    
                                }
                            }
                            dataProcess["B"] =eOption;
                            dataDll["B"] = eDll;
                        }

                    }else{
                        //console.log(iInfoProcess.A);
                        Object.keys(iInfoProcess).forEach(j => {
                            var vitem = iInfoProcess[j];
                            //console.log(j,vitem);
                            if(parseInt(vitem.HVS_DLL_LOAD.Count) > 0){
                                eOption = []; eDll = [];
                                for (var [i, item] of Object.values(vitem.HVS_DLL_LOAD).entries()) {
                                    if(i!=="Count" && parseInt(i) < parseInt(vitem.HVS_DLL_LOAD.Count)){
                                        var dllText = item.split(",");
                                        //console.log(dllText);
                                        if(parseInt(dllText[1])===1){
                                            item = dllText[0];
                                            eDll.push(item);
                                            item = item.slice(0, -4);
                                            eOption.push(item);
                                        }
                                    }
                                }
                                dataProcess[j] = eOption;
                                dataDll[j] = eDll;
                            }
                        });
                    }
                });
                // for(var i=0; i<iInfoProcess.length; i++) {
                //   var vitem = iInfoProcess[i];
                //     console.log(vitem);
                // }
            }
        }
        return {dProcess: dataProcess, dDll: dataDll};
    },
    checkSpecticalOptions: function(iLabel,sLabel){
        return (iLabel.includes(sLabel) || (iLabel.includes("RGB_CAL") && sLabel.includes("RGB_CAL")) || 
        (iLabel.includes("PDAF_CAL_YOUTHTECH") && sLabel.includes("PDAF_CAL_YOUTHTECH")) || 
        (iLabel.includes("PDAF_CAL_MIDDLE_CAPTURE") && sLabel.includes("PDAF_CAL_MIDDLE_CAPTURE")) || 
        (iLabel.includes("PDAF_CAL_MIDDLE_DLL_RUN") && sLabel.includes("PDAF_CAL_MIDDLE_DLL_RUN")) || 
        (iLabel.includes("PDAF_CAL_PAN_CAPTURE") && sLabel.includes("PDAF_CAL_PAN_CAPTURE")) || 
        (iLabel.includes("PDAF_CAL_PAN_DLL_RUN") && sLabel.includes("PDAF_CAL_PAN_DLL_RUN")) || 
        (iLabel.includes("PDAF_CAL_PAN") && sLabel.includes("PDAF_CAL_CHART")) || 
        (iLabel.includes("PDAF_CAL_CHART") && sLabel.includes("PDAF_CAL_PAN")) || 
        (iLabel.includes("GAIN_CHANGE_DARK") && sLabel.includes("GAIN_CONTROL_DARK")) || 
        (iLabel.includes("DATA_WRITE") && sLabel.includes("DATA_WRITE")) || 
        (iLabel.includes("SAMSUNG_LSC") && sLabel.includes("SAMSUNG_LSC")));
    }
    
}
module.exports = Libs;
