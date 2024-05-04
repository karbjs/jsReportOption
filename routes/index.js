var express = require('express');
var router = express.Router();
var fs = require('fs');
var ini = require('ini');
var path = require('path');
let pptxgen = require("pptxgenjs");

const libs = require('../public/libs/jblibs')

/* GET home page. */
router.get('/', function(req, res, next) {
  const path_config = './public/sources/config.ini';
  var configs = ini.parse(fs.readFileSync(path_config, 'utf-8'));
  var iModels = configs.Settings.Models.split(", ");
  var iMDefault = configs.Settings.Default;

  const SConfig = {
    iModels: iModels,
    iMDefault: iMDefault,
    iProcess: {},
    iPDefault: ''
  }
  res.render('index', { title: 'Report options', SConfig: SConfig});
});

router.get('/loadsetup', function(req, res, next) {
  var iMDefault = req.query.mod;
  var iPDefault = req.query.pro;

  var path_config = './public/sources/'+req.query.mod+'/setup.ini';
  var iInfo = ini.parse(fs.readFileSync(path_config, 'utf-8'));

  var iProcess = (iInfo.Info.Process !== undefined) ? iInfo.Info.Process.split(', ') : [];
  
  path_config = './public/sources/config.ini';
  var configs = ini.parse(fs.readFileSync(path_config, 'utf-8'));
  var iModels = configs.Settings.Models.split(", ");
  
  const SConfig = {
    iModels: iModels,
    iMDefault: iMDefault,
    iProcess: iProcess,
    iPDefault: iPDefault

  }
  res.render('partials/body', { title: 'Report options', SConfig: SConfig});
});

router.get('/getexportpptx', function(req, res, next) {
  var gModel = req.query.mod;
  var gProcess = req.query.pro;
  var pptxName = '';

  var dOptions;
  if(gProcess.toLocaleLowerCase()==="compare"){
    dOptions = libs.getDataCompare(gModel, gProcess);
  }else{
    dOptions = libs.getDataOption(gModel, gProcess);
  }

  // 1. Config File Pptx
  let pptx = new pptxgen();
  pptx.author = 'Mr.DuongNguyen';
  pptx.company = 'MCNEX VINA';
  pptx.revision = '01';
  pptx.subject = 'SW Team';
  pptx.title = 'Inspection Option Model ER';
  //console.log(gProcess);
  
  if(gProcess.toLocaleLowerCase()==="compare"){
      pptx.title = 'Compare Inspection Option Model ER';
      //console.log(dOptions.lProcess, dOptions);
      dOptions.lProcess.forEach(iProcess => {

        var iOptions = dOptions[iProcess];
        var sOptions = dOptions[iProcess+"_SUB"];
        var iMDexO = dOptions[dOptions.iMain+"_"+iProcess+"_IMG"];
        var iSDexO = dOptions[dOptions.iSub+"_"+iProcess+"_IMG"];
        var iMPath = "../sources/"+gModel+"/"+'/COMPARE/'+dOptions.iMain+'/'+iProcess+"/";
        var iSPath = "../sources/"+gModel+"/"+'/COMPARE/'+dOptions.iSub+'/'+iProcess+"/";
        libs.slideTitleCompareData(pptx, dOptions.iMain, dOptions.iSub, iProcess);
        //Option Load
        var isWaitting = 0, dnext = 0;
        //console.log(iOptions);
        Object.keys(iOptions).forEach(idex => {
          const iOption = iOptions[idex];
          //console.log(idex, iOption);
          var isMedia = iOptions.isMedia;
          if(idex !== "isMedia"){
              if(isMedia===1){
                dnext = parseInt(idex);
                // console.log(dnext, iDexO[dnext]);
                
                if(iOption!=undefined && iOption!=1){
                  if(iMDexO[dnext]!==undefined && iMDexO[dnext].iCount!=undefined){

                      var iCount = iMDexO[dnext].iCount, imgData = [];
    
                      for (var[ixd, iImgName] of Object.values(iMDexO[dnext].DIdex).entries()) {
                        var imgMData = iMPath+iImgName;
                        var imgSData = "";
                        if(iSDexO[idex] !== undefined && iSDexO[idex].DIdex!==undefined && iSDexO[idex].DIdex.includes(iImgName)){
                            imgSData = iSPath+iImgName;
                        }
                        txtHeader = iOption;
                        if(ixd!==0){
                            txtHeader = iOption+"_"+ixd;
                        }
                        libs.slideCompareData(pptx, txtHeader, dOptions.iMain, imgMData, dOptions.iSub, imgSData);
                      }
                  }else{
                      if(isWaitting===0){
                        libs.slideWaitSetting(pptx, iOption);
                        isWaitting = 1;
                      }
                  }
                }
              }else{
                  var settingSlide = "Spec Spec Setting of Site "+idex;
                  //console.log(idex);
                  if(isMedia === 2 && iProcess.toUpperCase() !="DUAL" && iProcess.toUpperCase() !="DUALCAL" && iProcess.toUpperCase() !="F150"){
                      settingSlide = "Spec Setting All Site"; var iImgName = "A.JPG";
                      var imgMData = iMPath+iImgName;
                      var imgSData = "";
                      if(iSDexO[idex] !== undefined && iSDexO[idex].DIdex!==undefined && iSDexO[idex].DIdex.includes(iImgName)){
                          imgSData = iSPath+iImgName;
                      }
                      libs.slideCompareData(pptx, settingSlide, dOptions.iMain, imgMData, dOptions.iSub, imgSData);

                  }else if(iMDexO[idex+"0"]!==undefined && iMDexO[idex+"0"].iCount===2){
                      var imlist = iDexO[idex+"0"] !== undefined ? iDexO[idex+"0"] : {};
                      if(imlist.iCount!== undefined){
                          for (var[ixd, iImgName] of Object.values(imlist.DIdex).entries()) {
                            var imgMData = iMPath+iImgName;
                            var imgSData = "";
                            if(iSDexO[idex+"0"] !== undefined && iSDexO[idex+"0"].DIdex!==undefined && iSDexO[idex+"0"].DIdex.includes(iImgName)){
                                imgSData = iSPath+iImgName;
                            }
                            txtHeader = settingSlide;
                            if(ixd!==0){
                                txtHeader = settingSlide+"_"+ixd;
                            }
                            libs.slideCompareData(pptx, txtHeader, dOptions.iMain, imgMData, dOptions.iSub, imgSData);
                          }
                      }
                  }
                  
                  //console.log(idex,iOptions, sOptions);
                  for (var[idxO, iLabel] of Object.values(iOption).entries()) {
                    idxO++; var listSite = {};
                    //console.log(idxO, idex, iDexO[idex+idxO]);
                    if(isMedia === 2 && iProcess.toUpperCase() !="DUAL" && iProcess.toUpperCase() !="DUALCAL" && iProcess.toUpperCase() !="F150"){
                        listSite = iMDexO[idxO] !== undefined ? iMDexO[idxO] : {};
                    }else{
                        listSite = iMDexO[idex+idxO] !== undefined ? iMDexO[idex+idxO] : {};
                    }
                    //console.log(listSite);
                    if(listSite.iCount!== undefined){
                      var sCount = 0;
                      var iCount = listSite.iCount, imgData = [];
                      for (var[ixd, iImgName] of Object.values(listSite.DIdex).entries()) {
                        var imgMData = iMPath+iImgName;
                        var imgSData = "";
                        if(isMedia === 2 && iProcess.toUpperCase() !="DUAL" && iProcess.toUpperCase() !="DUALCAL" ){
                          if(iOptions[idex].length == sOptions[idex].length){
                            if(iSDexO[idxO] !== undefined && iSDexO[idxO].DIdex!==undefined && iSDexO[idxO].DIdex.includes(iImgName)){
                              imgSData = iSPath+iImgName;
                            }
                          }else{
                            for (var[sdxO, sLabel] of Object.values(sOptions[idex]).entries()) {
                              if(libs.checkSpecticalOptions(iLabel,sLabel)){
                                if(iSDexO[(sdxO+1)] !== undefined && iSDexO[(sdxO+1)].DIdex!==undefined){
                                  var simg = (iSDexO[(sdxO+1)].DIdex[sCount]!=undefined)? iSDexO[(sdxO+1)].DIdex[sCount] : iSDexO[(sdxO+1)].DIdex[0];
                                  imgSData = iSPath+simg;
                                  sCount ++;
                                }
                              }
                            }
                          }
                        }else{
                          if(iOptions[idex].length == sOptions[idex].length){
                            if(iSDexO[idex+idxO] !== undefined && iSDexO[idex+idxO].DIdex!==undefined && iSDexO[idex+idxO].DIdex.includes(iImgName)){
                                imgSData = iSPath+iImgName;
                            }
                          }else{
                            for (var[sdxO, sLabel] of Object.values(sOptions[idex]).entries()) {
                              if(libs.checkSpecticalOptions(iLabel,sLabel)){
                                if(iSDexO[idex+(sdxO+1)] !== undefined && iSDexO[idex+(sdxO+1)].DIdex!==undefined){
                                  var simg = (iSDexO[idex+(sdxO+1)].DIdex[sCount]!=undefined)? iSDexO[idex+(sdxO+1)].DIdex[sCount] : iSDexO[idex+(sdxO+1)].DIdex[0];
                                  imgSData = iSPath+simg;
                                  sCount ++;
                                }
                              }
                            }
                          }
                        }
                        
                        txtHeader = iLabel;
                        if(ixd!==0){
                            txtHeader = iLabel+"_"+ixd;
                        }
                        libs.slideCompareData(pptx, txtHeader, dOptions.iMain, imgMData, dOptions.iSub, imgSData);
                      }
                      
                    }else{
                      var jumpF = iMDexO[idex+idxO+".0"]; var ind = 0;
                      while(jumpF !== undefined){
                        listSite = iMDexO[idex+idxO+"."+ind];
                        for (var[ixd, iImgName] of Object.values(listSite.DIdex).entries()) {
                            var imgMData = iMPath+iImgName;
                            var imgSData = "";
                            if(iSDexO[idex+idxO+"."+ind] !== undefined && iSDexO[idex+idxO+"."+ind].DIdex!==undefined && iSDexO[idex+idxO+"."+ind].DIdex.includes(iImgName)){
                                imgSData = iSPath+iImgName;
                            }
                            txtHeader = iLabel;
                            if(ixd!==0){
                                txtHeader = iLabel+"_"+ixd;
                            }
                            libs.slideCompareData(pptx, txtHeader, dOptions.iMain, imgMData, dOptions.iSub, imgSData);
                        }
                        
                        ind++;
                        jumpF = iMDexO[idex+idxO+"."+ind];
                      }
                    }
                  }
              }
              
          }
        });
      });

      libs.slideEndData(pptx);
  }else{
    // 2. Content Data
    if(dOptions.cProcess > 1){
      //List Proccess slide
      libs.slideProcessData(pptx, dOptions.iName, dOptions.iType, dOptions.iSize, dOptions.lProcess);
    }
    dOptions.lProcess.forEach(iProcess => {
      var iPath = "../sources/"+gModel+"/"+iProcess+"/";
      var iDexO = dOptions[iProcess+"_IMG"];
      var iOptions = dOptions[iProcess];
  
      //title Process
      libs.slideTitleData(pptx, dOptions.iName, dOptions.iType, dOptions.iSize, iProcess);
      //console.log(iDexO);
      if(iProcess.toLowerCase() !== "memory" || (iProcess.toLowerCase() === "memory" && iOptions[1]!== undefined && iOptions[1].toLocaleLowerCase()!=='map check')){
        //Slide Main
        var imgMain = {"M":iPath+"M.jpg"}, imgNum = 1;
        if(iOptions.isMedia===1){
            imgMain.O = iPath+"O.jpg"; imgNum = 2;
        };
        //console.log(imgMain);
        libs.slideisMainData(pptx, imgMain, imgNum);
        //Power setting
        if(iOptions.isMedia===1 && iDexO["S"] !== undefined && iDexO["P"] !== undefined){
            var imgSPower = {"S":iPath+"S.jpg", "P":iPath+"P.jpg"};
            libs.slideisSPowerData(pptx, imgSPower, 2);
        }else if(iDexO["P"] !== undefined){
            var imgSPower = {"P":iPath+"P.jpg"};
            //console.log(imgSPower);
            libs.slideisSPowerData(pptx, imgSPower, 1);
        }else if(iDexO["S"] !== undefined){
            var imgSPower = {"S":iPath+"S.jpg"};
            libs.slideisSPowerData(pptx, imgSPower, 1);
        }
      }
  
      //Setup Option
      if(iProcess==="OTP" && iDexO["MT"] !== undefined){
        libs.slideOtpSetUpData(pptx, iPath);
      }
      //console.log(iOptions);
      //Option Load
      var isWaitting = 0, dnext = 0;
      Object.keys(iOptions).forEach(idex => {
        const iOption = iOptions[idex];
        //console.log(idex, iOption);
        var isMedia = iOptions.isMedia;
        if(idex !== "isMedia"){
            if(isMedia===1){
              dnext = parseInt(idex);
              // console.log(dnext, iDexO[dnext]);
              
              if(iOption!=undefined && iOption!=1){
                if(iDexO[dnext]!==undefined && iDexO[dnext].iCount!=undefined){
                    var iCount = iDexO[dnext].iCount, imgData = [];
  
                    for (var[ixd, iImgName] of Object.values(iDexO[dnext].DIdex).entries()) {
                      imgData.push(iPath+iImgName);
                    }
                    //console.log(imgData);
                    libs.slideSpecData(pptx, iOption, imgData, iCount);
                }else{
                    if(isWaitting===0){
                      libs.slideWaitSetting(pptx, iOption);
                      isWaitting = 1;
                    }
                }
              }
            }else{
                var settingSlide = "Spec Spec Setting of Site "+idex,
                imgData = [iPath+idex+"0.jpg"], iCount = 1;
                //console.log(idex);
                if(isMedia === 2 && iProcess.toUpperCase() !="DUAL" && iProcess.toUpperCase() !="DUALCAL" && iProcess.toUpperCase() !="F150"){
                    settingSlide = "Spec Setting All Site"; iCount = 4;
                    imgData = [iPath+"A.jpg",iPath+"B.jpg",iPath+"C.jpg",iPath+"D.jpg"];
                }else if(iDexO[idex+"0"]!==undefined && iDexO[idex+"0"].iCount===2){
                    var imlist = iDexO[idex+"0"] !== undefined ? iDexO[idex+"0"] : {};
                    if(imlist.iCount!== undefined){
                        iCount = imlist.iCount;
                        imgData = [];
                        for (var[ixd, iImgName] of Object.values(imlist.DIdex).entries()) {
                            imgData.push(iPath+iImgName);
                        }
                        //console.log(imgData);
                    }
                }
                //console.log(imgData);
                libs.slideSpecData(pptx, settingSlide, imgData, iCount);
                //console.log(iOption);
                for (var[idxO, iLabel] of Object.values(iOption).entries()) {
                  idxO++; var listSite = {};
                  //console.log(idxO, idex, iDexO[idex+idxO]);
                  if(isMedia === 2 && iProcess.toUpperCase() !="DUAL" && iProcess.toUpperCase() !="DUALCAL" && iProcess.toUpperCase() !="F150"){
                      listSite = iDexO[idxO] !== undefined ? iDexO[idxO] : {};
                  }else{
                      listSite = iDexO[idex+idxO] !== undefined ? iDexO[idex+idxO] : {};
                  }
                  //console.log(listSite);
                  if(listSite.iCount!== undefined){
                      var iCount = listSite.iCount, imgData = [];
                      for (var[ixd, iImgName] of Object.values(listSite.DIdex).entries()) {
                          //console.log(iImgName);
                          imgData.push(iPath+iImgName);
                      }
                      //console.log(imgData);
                      libs.slideSpecData(pptx, iLabel, imgData, iCount);
                  }else{
                      if(isWaitting===0){
                          libs.slideWaitSetting(pptx,iLabel);
                          isWaitting = 1;
                      }
                  }
                }
            }
            
        }
      });
  
    });

    libs.slideEndData(pptx, dOptions.iName, dOptions.iType, dOptions.iSize);
  }

  // 3. Save the Presentation
  pptxName = 'Options Model '+dOptions.iName+' '+dOptions.iType+' '+dOptions.iSize+' All Process';
  if(gProcess === "ext"){
    pptxName = 'Options Model '+dOptions.iName+' '+dOptions.iType+' '+dOptions.iSize+' Extend Process';
  }
  if(dOptions.cProcess === 1){ 
    pptxName = 'Options Model '+dOptions.iName+' '+dOptions.iType+' '+dOptions.iSize+' '+gProcess+' Process';
  }
  if(gProcess.toLocaleLowerCase()==="compare"){
    pptxName = 'Compare Options Model '+dOptions.iMain +' & '+dOptions.iSub +' All Process';
  }

  pptx.writeFile("./public/"+pptxName)
  .then(function (fileName) { 
    res.send(fileName.split("/")[2]);
    console.log('Saved! File Name: ' + fileName) 
  });

      
});

router.get('/getdatatranslate', function(req, res, next) {
  var gModel = req.query.mod;
  var gProcess = req.query.pro;
  dOptions = libs.getDataOption(gModel, gProcess);
  //console.log(dOptions);
  var path_lang = './public/libs/Dll_translates.ini';
  var lang = ini.parse(fs.readFileSync(path_lang, 'utf-8'));
  //console.log(lang);
  var iaData = [];
  dOptions.lProcess.forEach(iProcess => {
    var iDll = dOptions[iProcess+"_DLL"];
    var iOptions = dOptions[iProcess];
    //console.log(iDll,iOptions);
    if(iProcess.toLowerCase() !== "memory" || (iProcess.toLowerCase() === "memory" && iOptions[1]!== undefined && iOptions[1].toLocaleLowerCase()!=='map check')){
      Object.keys(iOptions).forEach(idex => {
        const iOption = iOptions[idex];
        const dDll = iDll[idex];
        var isMedia = iOptions.isMedia;
        if(idex !== "isMedia"){
          if(isMedia===1){
            var sData = {};
            sData.iFunction = libs.getLang(lang, dDll.slice(0,-4));
            sData.iLabel = iOption;
            sData.iProcess = iProcess;
            sData.iName =  dOptions.iName;
            sData.iSize = (dOptions.iType==="DUAL")? dOptions.iType : dOptions.iSize;
            iaData.push(sData);
        
          }else{
            for (var[idxO, iLabel] of Object.values(iOption).entries()) {
              var lDll = dDll[idxO];
              //console.log(idxO,lDll.slice(0,-4));  
              idxO++; 
              var sData = {};
              sData.iFunction = libs.getLang(lang, lDll.slice(0,-4));
              sData.iLabel = iLabel;
              sData.iProcess = iProcess;
              sData.iName =  dOptions.iName;
              sData.iSize = (dOptions.iType==="DUAL")? dOptions.iType : dOptions.iSize;
              iaData.push(sData);
            }
            //console.log(iaData);
          }
          
        }
      });
    }
  });
  res.send({iData: iaData, iModel: dOptions.iName+"_"+dOptions.iType+"_"+dOptions.iSize});
});

module.exports = router;
