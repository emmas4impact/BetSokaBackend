const express = require("express");
const UserModel = require("./Schema");
const mailgun = require("mailgun-js");
const jwt = require("jsonwebtoken")
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
const {
  authenticate,
  refreshToken
} = require("../auth/authTools");
const {
  authorize,
  adminOnlyMiddleware
} = require("../middlewares/authorize");
const { json } = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const passport = require("passport");

router.post("/register", async (req, res) => {
  try {
    const {name,surname,username,phone,dob,email,password,role}=req.body;
  
    UserModel.findOne({email}).exec((err, user)=>{
      if(user){
        return res.status(409).send("user with same email exists");
        
      }
      
      const token = jwt.sign(
        {name,surname,username,phone,dob,email,password,role},
        process.env.ACC_ACTIVATION_KEY, {
          expiresIn: "30m"
        }
      );
      
      const data = {
        from: 'noreply@betsoka.com.ng',
        to: email,
        subject: 'Account Activation Link',
        html: `<h2> Please click on given link to activate your account</h2>
        <a href="${process.env.CLIENT_URL}/authentication/activate/${token}">Activate your account!</a>
        <p>${process.env.CLIENT_URL}/authentication/activate/${token}</>
        `
      };
      mg.messages().send(data, function (error, body) {
        if(error){
          return res.json({
            error: err.message
          })
        }
        return res.json({message: "Email has been sent kindly activate your account"})
      });
     
    })
    
    
  } catch (error) {
    
    res.send(error.errors);
  }
});
router.post("/email-activate", async (req, res, next) => {
  try {
    const {
      token
    } = req.body;
    if(token){
      jwt.verify(token, process.env.ACC_ACTIVATION_KEY, function (err, decodedToken) {
        if(err){
          return res.status(400).json({error: "Incorrect or Expired link."})
        }
       
        try {
          const {name,surname,username,phone,dob,email,password,role}=decodedToken;
          console.log(decodedToken)
          UserModel.findOne({email}).exec((err, user)=>{
            if(user){
              return res.status(409).send("user with same email exists");
              
            }
            let newUser = new UserModel({name,surname,username,phone,dob,email,password,role});
            newUser.save((err, success)=>{
              if(err){
                console.log("Error in signup", err)
                return res.status(400), json({error: err})
              }
              res.json({message: "Register successfully!"})
            });
          })
        
        } catch (error) {
          
          res.send(error.errors);
        }
        
      })
    }else{
      return res.json({error: "Invalid activation please check your email"});
    }
    
  } catch (error) {
    next(error)
  }

})

router.get("/", adminOnlyMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find(req.query)
    res.send({
      data: users,
      total: users.length
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.get("/me", authorize, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next("While reading users list a problem occurred!")
  }
})

router.get("/:id", authorize, async (req, res, next) => {
  try {
    const users = await UserModel.findById(req.params.id)
    res.send(users)
  } catch (error) {
    console.log(error)
    next(error)
  }
})


router.put("/:username", authorize, async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(req.params.username, {
      ...req.body
    })

    if (updatedUser)
      res.send("user details updated ")
    res.send(`${req.params.name} not found`)
  } catch (error) {
    next(error)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body
    const user = await UserModel.findByCredentials(email, password)
    console.log(user)
    const tokens = await authenticate(user)
    console.log("newly generated token : ", tokens)
    res.cookie("accessToken", tokens.token)
    res.cookie("refreshToken", tokens.refreshToken)
    res.send("login successfully")
  } catch (error) {
    next(error)
  }

})
router.post("/logout", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (t) => t.token !== req.body.refreshToken
    )
    await req.user.save()
    res.send()
  } catch (err) {
    next(err)
  }
})

router.post("/logoutAll", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = []
    await req.user.save()
    res.send()
  } catch (err) {
    next(err)
  }
})

router.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken
  if (!oldRefreshToken) {
    const err = new Error("Forbidden")
    err.httpStatusCode = 403
    next(err)
  } else {
    try {
      const newTokens = await refreshToken(oldRefreshToken)
      res.send(newTokens)
    } catch (error) {
      console.log(error)
      const err = new Error(error)
      err.httpStatusCode = 403
      next(err)
    }
  }
})

module.exports = router;