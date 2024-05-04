var express = require('express');
var router = express.Router();
var fs = require('fs');
var ini = require('ini');
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const path_config = './public/profiles/config.ini';
  var iProfiles = ini.parse(fs.readFileSync(path_config, 'utf-8'));
  var iData = {};
  if(iProfiles!==undefined){
    var iLists = iProfiles.Groups.Lists.split(", ");
    iData.aGroup = iLists;
    for(var l in iLists){
      var iGroup = iLists[l];
      var dGroup = iProfiles[iGroup];
      if(dGroup.Members!==""){
        var dMembers =  dGroup.Members.split(", ");
        iData[iGroup] = {};
        if(dGroup.Team_Work !== ''){
          var dTeams =  dGroup.Team_Work.split(", ");
          iData[iGroup].Teams = dTeams;
          for(var m in dMembers){
            for(var dt in dTeams){
              var iMems = dMembers[m].split("_");
              if(iMems[0]===dTeams[dt]){
                var sTeam = iMems[0];
                var iMember = iMems[1];
                var pavatar = './profiles/'+iGroup+"/"+sTeam+"/"+iMember+"/";
                var mPath = './public/profiles/'+iGroup+"/"+sTeam+"/"+iMember+"/profile.ini";
                if(iData[iGroup][sTeam] === undefined) iData[iGroup][sTeam] = {};
                var iProfile = ini.parse(fs.readFileSync(mPath, 'utf-8'));
                iProfile.iImage = pavatar+'avatar.jpg';
                iData[iGroup][sTeam][iMember]=iProfile;
              }
            }
          }
        }
      }
    }
  }
  const SConfig = {
    iData: iData
  }
  //console.log(SConfig);
  res.render('user', { title: 'R&D Profiles', SConfig: SConfig});
});

module.exports = router;
