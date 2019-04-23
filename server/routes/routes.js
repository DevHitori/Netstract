require('dotenv').config()
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');
var youtubedl = require('youtube-dl');
var fs = require('fs');
var path = require('path');

const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const ApiTokens = require('../../models/ApiTokens');
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET


//Routes

router.get('/', function(req, res){
  res.render('index');
});

router.get('/video', function(req, res){
  res.render('index');
});

router.get('/api', function(req, res){
  res.render('index');
});

router.get('/contactus', function(req, res){
  res.render('index');
});

router.get('/login', function(req, res){
  res.render('index');
});

router.get('/signup', function(req, res){
  res.render('index');
});

router.get('/netstractedvideo', function(req, res){
  res.sendFile(path.resolve(`videos/${req.query.file}`));
});


//Modular Netstract Apis
/*=======================================================================================================================*/

router.get('/netstract/api/v1/video', catchAsync(async (req, res)=>{
 const { link , email , password } = req.query;
 var options=[];
 var auth = false;
 var info;

 var hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);


if (!email || !password) {
    return res.send({success:false,reason:"Validate with Email and Password"});
  }else if (!link) {
    return res.send({success:false,reason:"no link sent"});
  }

  await User.find({
    email: email
  }, (err, previousUsers) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Server Error'
      });
    } else if (previousUsers.length < 1){
      return res.send({
        success: false,
        message: "Account Doesn't Exist"
      });
    }else{
      auth=true;
    }
  })


if (auth) {

  var video = await youtubedl(link, options);


  video.on('info', function(info) {
    info = info;
  });

  video.on('error', function error(err) {
   return res.send({success:false,reason:err});
 });


  video.on('end', function() {
  return res.send({success: true,video_info:info,video_url: `www.netstract.xyz/netstractedvideo?file=${hash}.mp4`});
});
console.log(video);

  video.pipe(fs.createWriteStream(`videos/${hash}.mp4`));
}
}));













/*=======================================================================================================================*/
//Methods
  // login

router.get('/api/user/check', (req, res, next) => {
const { query } = req;
const { token } = query;
UserSession.find({
  _id: token,
  isDeleted: false
}, (err, sessions) => {
  if (err) {
    console.log(err);
    return res.send({
      success: false,
      message: 'Error: Server error'
    });
  }
  if (sessions.length != 1) {
    return res.send({
      success: false,
      message: 'Error: Invalid'
    });
  } else {
    const session = sessions[0];
    if (session.userId ==null || session.userId =="") {
      return res.send({
        success: false
      });
    }
    return res.send({
      success: true,
      message: session.userId
    });
  }
});
});




//Accounts
  //Validations
  router.get('/api/user/email', (req, res, next) => {
    var { email } = req.query;


    email = email.toLowerCase();
    email = email.trim();

    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: 0,
          message: 'Server Error'
        });
      } else if (previousUsers.length > 0){
        return res.send({
          success: 0,
          message: 'Account already exist.'
        });
      }else{
        return res.send({
          success: 1,
          message: 'Valid'
        });
      }
    });
  }); // end of email validation



/*
 * Sign up
 */
router.post('/api/user', (req, res, next) => {
  var { email,password,tosAgreement } = req.query;

  email = email.toLowerCase();
  email = email.trim();

    // Save the new user
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.generateHash(password);
    newUser.save((err, user) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Signed up'
      });
    });
}); // end of sign up endpoint



router.get('/api/user', (req, res, next) => {
    let { email, password } = req.query;
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }
    email = email.toLowerCase();
    email = email.trim();
    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        console.log('err 2:', err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }
      // Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }
        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });
      });
    });
  }); // signin


//delete login session
  router.delete('/api/user', (req, res, next) => {
      // Get the token
      const { query } = req;
      const { token } = query;
      // ?token=test
      // Verify the token is one of a kind and it's not deleted.
      UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
      }, {
        $set: {
          isDeleted:true
        }
      }, null, (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Good'
        });
      });
    });


    router.get('/api/user/data', (req, res, next) => {
    // Get the token
    const { id } = req.query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    User.find({
      _id: id
    }, (err, users) => {
      if (err) {
        console.log('err 2:', err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }
      const user = users[0];
      console.log(user);
        return res.send({
          success: true,
          user: user
        });

      });
  });

//Video Apis
router.get('/api/videoinfo', catchAsync(async(req, res, next) => {
  const { link } = req.query;

  youtubedl.getInfo(link, function(err, info) {
  if (err){
    console.log(err);
    return res.send({success:false,error:'Invalid Link'});
  }
  return res.send({success:true,info:info});
  });

}));






router.get('/api/video', catchAsync(async(req, res, next) => {
  const { link,name,ext,format_id } = req.query;
  //var options = [`--format=${format_id}`];

  if (!link) {
    return res.send({success:false,reason:"no link sent"});
  }

  if (req.query.username && req.query.password ) {
    const { username , password } = query;
    options.push(`--username=${username}`);
    options.push(`--password=${password}`);
  }

  var video = await youtubedl(link, options);

  var size = 0;
  var percent = 0;
  video.on('info', function(info) {
    size = info.size;
    console.log('id:', info.id);
    console.log('title:', info.title);
    console.log('url:', info.url);
    console.log('thumbnail:', info.thumbnail);
    console.log('description:', info.description);
    console.log('filename:', info._filename);
    console.log('format id:', info.format_id);
  });

  video.on('error', function error(err) {
   console.log('error 2:', err);
   return res.send({success:false,reason:"server 2 error"});
 });

 var pos = 0;
  video.on('data', function data(chunk) {
    pos += chunk.length;
    if (size) {
      percent = (pos / size * 100).toFixed(2);
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write(percent + '%');
    }
  });

  video.on('end', function() {
  console.log("[*] Download Finished!");
  return res.send({success: true,netstractedVideo: `${name}.${ext}`});
});

console.log(video);
console.log("[*] Download Staring..");
video.pipe(fs.createWriteStream(`videos/${name}.${ext}`));

  }));


module.exports = router;
