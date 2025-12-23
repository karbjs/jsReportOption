const ini = require('ini');
const fs = require('fs');
const cmd= require('node-cmd');
var Path = require('path');

//Function 
const getDirectories = source =>
fs.readdirSync(source, { withFileTypes: true })
.filter(item => item.isDirectory())
.map(item => item.name.toLocaleUpperCase());

const getInfoFile = source =>
fs.readdirSync(source, { withFileTypes: true })
.filter(item => {
  return (!item.isDirectory() && (Path.extname(item.name).toLowerCase() === ".ccf4" || Path.extname(item.name).toLowerCase() === ".ini"));
})
.map(item => item.name );

function cPosition(OjProcess, tValue, nidx){
  const key = Object.keys(OjProcess).find(key => OjProcess[key] === tValue);
  const temp = OjProcess[nidx];
  OjProcess[nidx] = tValue;
  OjProcess[key] = temp;
  //console.log(OjProcess);
  return OjProcess;
}

function cRPosition(OjProcess, tValue){
  const key = Object.keys(OjProcess).find(key => OjProcess[key] === tValue);
  delete OjProcess[key];
  return OjProcess;
}

function sortProcess(arProcess){
  var cMFa = 0, cMFb=0, cOIS =0, cOTP = 0, cPDAF = 0, ciPDAF = 0, cDFa = 0, cDFb=0, cDUAL = 0, cMEMO = 0, cProcess=0;
  var iProcess = arProcess.map(element => {
      return element.toUpperCase();
  });
  var jpre = "";
  var OjProcess = Object.assign({}, arProcess);
  //MF Process
  if(iProcess.indexOf("MF") !== -1 || iProcess.indexOf("MF(MAIN)") !== -1 ){
      jpre = "MF(MAIN)";
      if(iProcess.indexOf("MF(MAIN)") === -1){
          jpre = "MF"; 
      }
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cMFa++;
      cProcess = cMFa;
      console.log(cProcess+":"+jpre);
  }
  //SUB
  if(iProcess.indexOf("MF(SUB)") !== -1 ){
      if(cMFa > 0){
          cMFb = cProcess;
      }

      jpre = "MF(SUB)";
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cMFb++;
      cProcess = cMFb;
      console.log(cProcess+":"+jpre);
  }

  if(iProcess.indexOf("OIS") !== -1){
      if(cProcess > 0){
          cOIS = cProcess;
      }
      jpre = "OIS";
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cOIS++;
      cProcess = cOIS;
      console.log(cProcess+":"+jpre);
  }
  if(iProcess.indexOf("MF&OTP") !== -1){
    if(cProcess > 0){
        cOTP = cProcess;
    }
    jpre = "MF&OTP";
    OjProcess = cPosition(OjProcess, jpre, cProcess); 
    cOTP++;
    cProcess = cOTP;
    console.log(cProcess+":"+jpre);
}
  if(iProcess.indexOf("OTP") !== -1){
      if(cProcess > 0){
          cOTP = cProcess;
      }
      jpre = "OTP";
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cOTP++;
      cProcess = cOTP;
      console.log(cProcess+":"+jpre);
  }
  if(iProcess.indexOf("PDAF") !== -1 || iProcess.indexOf("PDAF(INF)") !== -1){
      if(cProcess > 0){
          cPDAF = cProcess;
      }
      jpre = "PDAF(INF)";
      if(iProcess.indexOf("PDAF(INF)") === -1){
          jpre = "PDAF"; 
      }
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cPDAF++;
      cProcess = cPDAF;
      console.log(cProcess+":"+jpre);
  }
  if(iProcess.indexOf("PDAF(MAC)") !== -1){
      if(cProcess > 0 ){
          ciPDAF = cProcess;
      }
      jpre = "PDAF(MAC)";
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      ciPDAF++;
      cProcess = ciPDAF;
      console.log(cProcess+":"+jpre);
  }

  if(iProcess.indexOf("DUALCAL") !== -1 || iProcess.indexOf("DUAL") !== -1){
      if(cProcess > 0 ){
          cDUAL= cProcess;
      }
      jpre = "DUALCAL";
      if(iProcess.indexOf("DUALCAL") === -1){
          jpre = "DUAL"; 
      }
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cDUAL++;
      cProcess = cDUAL;
      console.log(cProcess+":"+jpre);
  }
  if(iProcess.indexOf("DF") !== -1 || iProcess.indexOf("DF(MAIN)") !== -1){
      if(cProcess > 0 ){
          cDFa= cProcess;
      }
      jpre = "DF(MAIN)";
      if(iProcess.indexOf("DF(MAIN)") === -1){
          jpre = "DF"; 
      }
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cDFa++;
      cProcess = cDFa;
      console.log(cProcess+":"+jpre);
  }
  if(iProcess.indexOf("OTP&DF") !== -1){
    if(cProcess > 0 ){
        cDFb= cProcess;
    }
    jpre = "OTP&DF";
    OjProcess = cPosition(OjProcess, jpre, cProcess); 
    cDFb++;
    cProcess = cDFb;
    console.log(cProcess+":"+jpre);
}
  if(iProcess.indexOf("DF(SUB)") !== -1){
      if(cProcess > 0 ){
          cDFb= cProcess;
      }
      jpre = "DF(SUB)";
      OjProcess = cPosition(OjProcess, jpre, cProcess); 
      cDFb++;
      cProcess = cDFb;
      console.log(cProcess+":"+jpre);
  }
  if(iProcess.indexOf("MEMORY") !== -1){
      if(cProcess > 0 ){
          cMEMO= cProcess;
      }
      jpre = "MEMORY";
      OjProcess = cPosition(OjProcess, jpre, cProcess);
      cMEMO++;
      cProcess = cMEMO;
      console.log(cProcess+":"+jpre);
  }
  return OjProcess;
}

  //Start Server
var jbuild = {
    //Report Option Start ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    fOptions : function(){
      cmd.runSync('@echo off');
      const jSpath = '../public/sources/';
      const jNMpath = '../new_models/';

      const Spath = Path.resolve(__dirname,jSpath);
      const NMpath = Path.resolve(__dirname,jNMpath);

      //console.log(Spath,NMpath);
      var path_config = Path.resolve(__dirname,jSpath+'config.ini');
      var config = ini.parse(fs.readFileSync(path_config, 'utf-8'));

      var modules = getDirectories(Spath);
      var newModel = getDirectories(NMpath);
      var defaultN = "";
      if(newModel.length > 0){
          modules.forEach(element => {
              cmd.runSync('rmdir /s/q "'+Spath+"//"+element+'"');
          });
          defaultN = newModel[0];
          newModel.forEach(element => {
              //console.log(element);
              cmd.runSync('mkdir "'+Spath+"//"+element+'" /y');
              cmd.runSync('xcopy "'+NMpath+"//"+element+'" "'+Spath+"//"+element+'" /s /e /y /h');
              cmd.runSync('rmdir /s/q "'+NMpath+"//"+element+'"');
              //console.log('rmdir /s/q "'+NMpath+element+'"');
          });
          for(var i in newModel){
              if(modules.indexOf(newModel[i])===-1){
                  modules.push(newModel[i]);
              }
          }
      }
      //console.log(modules);
      if(config.Settings === undefined){
          config.Settings = {"Models":"","Default":""};
      }

      config.Settings.Models = modules.join(", ");
      //console.log(config.Settings.Default);
      //config.Settings.Default = (modules[0] !== undefined) ? modules[0] : "";
      if(newModel.length > 0){
          config.Settings.Default = newModel[0];
      }else if(config.Settings.Default==="" || (config.Settings.Default!=="" && modules.indexOf(config.Settings.Default)==-1)){
          config.Settings.Default = (modules[0] !== undefined) ? modules[0] : "";
      }
      fs.writeFileSync(Path.resolve(__dirname,jSpath+'config.ini'), ini.stringify(config));

      const syncDir = cmd.runSync('start /B CMD /C CALL '+Spath+'//convertJPG.bat');
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      for(var i=0;i<modules.length; i++){
            const PPath = Path.resolve(__dirname,jSpath+modules[i]);
            const iName = modules[i].split("_").slice(0, -1).join("_");
            const iSize = modules[i].split("_").pop();
            cmd.runSync('@copy "'+Spath+'\\setup.ini" "'+PPath+'"');
            //console.log('@copy "'+Spath+'//setup.ini" "'+PPath+'"');
            var iProcess = getDirectories(PPath);

            var iSetup = ini.parse(fs.readFileSync(PPath+'\\setup.ini', 'utf-8'));
            iSetup.Info.ModelName = iName;
            iSetup.Info.Size = iSize;
            iSetup.Info.Type = "Single";
            iSetup.Info.FitType = 0;
            if(iSize.toLocaleUpperCase() === "DUAL" || iSize.toLocaleUpperCase() === "TRIP"){
                iSetup.Info.Size = "";
                iSetup.Info.Type = iSize;
            }
            console.log("Model Options:"+iName+"_"+iSize);
            var oProcess = sortProcess(iProcess);
            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            //console.log(Object.values(oProcess));
            iSetup.Info.Process= Object.values(oProcess).join(", ");
            //console.log(iSetup); 
            for(var ip=0;ip<iProcess.length; ip++){
              var iProc = iProcess[ip].toLocaleUpperCase();
              var iPpath = PPath+"\\"+iProc;
              var CCF4 = getInfoFile(iPpath)[0];
              //console.log(CCF4);
              var ojPush = {};
              if(CCF4!==undefined && CCF4 !==""){
                  ojPush = {"isMain":0, "isFit": 0,"CCFN":""};
                  if(iProc==="MF" || iProc==="MF&OTP" || iProc==="MF(MAIN)" || iProc==="MF(SUB)" || iProc==="OIS"
                  || iProc==="OTP" || iProc==="PDAF" || iProc==="PDAF(MAC)" || iProc==="PDAF(INF)" || iProc==="DUALCAL" || iProc==="DUAL"
                  || iProc==="DF" || iProc==="OTP&DF"  || iProc==="DF(MAIN)" || iProc==="DF(SUB)" || iProc==="DF1" || iProc==="DF2"
                  || iProc==="MEMORY"){
                      ojPush.isMain = 1;
                      if(iProc==="MF&OTP"){
                        ojPush.isFit = 1;
                        iSetup.Info.FitType = 1;
                      }else if(iProc==="OTP&DF"){
                        ojPush.isFit = 2;
                        iSetup.Info.FitType = 2;
                      }
                  }
                  ojPush.CCFN = CCF4;
                  iSetup[iProc] = ojPush;
              }else if(iProc==="COMPARE"){
                  var iBoth = getDirectories(iPpath); var ibMain = iName+"_"+iSize; var ibProcess = "";  var labs = {}; var isSetMain = 0;
                  for(var ib =0;ib<iBoth.length;ib++){
                      var iBPath = iPpath+"\\"+iBoth[ib].toLocaleUpperCase();
                      var iBcoth = getDirectories(iBPath); 
                      for(var ibc =0;ibc<iBcoth.length;ibc++){
                          var iCCF4 = getInfoFile(iBPath+"\\"+iBcoth[ibc].toLocaleUpperCase())[0];
                          if(iCCF4!==undefined && CCF4 !==""){
                              ibProcess = Object.values(iBcoth).join(", ");
                              if(isSetMain == 0 && ibProcess!=ibMain) {
                                  ibMain = ibProcess = iBoth[ib].toLocaleUpperCase();
                                  isSetMain = 1;
                              }
                              labs[iBcoth[ibc].toLocaleUpperCase()] = iCCF4;
                          }
                      }
                  }
                  console.log("Compare Process:",ibProcess);
                  ibProcess = sortProcess(ibProcess.split(", "));
                  var iCompare = {"isMain":0, "Both": Object.values(iBoth).join(", "),"Main": ibMain, "Process": ibProcess, labs };
                  iSetup[iProc] = iCompare;
              }


              
            }

            if(iSetup.Info.FitType != 0){
                
                for(var ip=0;ip<iProcess.length; ip++){
                    var iProc = iProcess[ip].toLocaleUpperCase();
                    var ojPush = iSetup[iProc];
                    if(iSetup.Info.FitType == 1){
                        if(iProc==="MF&OTP" || iProc==="DF" || iProc==="DF(MAIN)" || iProc==="DF(SUB)" || iProc==="DF1" || iProc==="DF2" || iProc==="MEMORY"){
                            ojPush.isFit = 1;
                        }else{
                            ojPush.isFit = 0;
                        }
                    }else if(iSetup.Info.FitType == 2){
                        if(iProc==="MF" || iProc==="MF(MAIN)" || iProc==="MF(SUB)" || iProc==="OIS"  || iProc==="OTP&DF" || iProc==="MEMORY"){
                            ojPush.isFit = 2;
                        }else{
                            ojPush.isFit = 0;
                        }
                    }else{
                        ojPush.isFit = 0;
                    }
                    iSetup[iProc] = ojPush;
                }
            }
          //console.log(iSetup);
          fs.writeFileSync(PPath+'\\setup.ini', ini.stringify(iSetup));
          build = 1;
        }
      cmd.runSync('@echo on');
    },

    //Department R&D Camera Start +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    fProfiles : function(){
      cmd.runSync('@echo off');
      const jPpath = '../public/profiles/';

      const Ppath = Path.resolve(__dirname,jPpath);
      config = ini.parse(fs.readFileSync(Path.resolve(__dirname,jPpath+'config.ini'), 'utf-8'));
      var pGroups = getDirectories(Ppath);
      config.Groups.Lists = pGroups.join(", ");
      for(var i in pGroups){
          var aG = pGroups[i];
          var DirTeam = Ppath+"\\"+aG+"\\";
          var aGTeam = config[aG] !== undefined ? config[aG] : {"Team_Work": "", "Members": ""};
          var pTeams = getDirectories(DirTeam);
          aGTeam.Team_Work = pTeams.join(", ");
          var aMembers = [];
          for(var t in pTeams){
              var pMembers = getDirectories(DirTeam+pTeams[t]+"\\");
              for(var tm in pMembers){
                  pMembers[tm] = pTeams[t]+"_"+pMembers[tm]
              }
              aMembers.push(...pMembers);
          }
          aGTeam.Members = aMembers.join(", ");
          config[aG] = aGTeam;
      }

      fs.writeFileSync(Path.resolve(__dirname,jPpath+'config.ini'), ini.stringify(config));
      build = 2;
      //console.log(config);
      cmd.runSync('@echo on');
    },
    fOpenBrowser : function(PORT){
        const root = Path.resolve(__dirname,"../public/");
        //console.log(Path.resolve(__dirname,"../public/"));
        cmd.runSync('cd /D root');
        cmd.runSync('del /F /S /Q /A *.pptx');
        cmd.runSync('start http://localhost:'+PORT);
    }

  };

//jbuild.fOptions();
module.exports = jbuild;