const express =require('express');
const ResultModel = require("./Schema");
const {
    authenticate,
    refreshToken
  } = require("../auth/authTools");
  const {
    authorize,
    adminOnlyMiddleware
  } = require("../middlewares/authorize");
  const { json } = require("express");
  const result = express.Router();
  
  result.get("/", authorize, adminOnlyMiddleware, async (req, res, next)=>{
     try {
        const showResult = await ResultModel.find(req.params);
        if(showResult){
            res.status(200).send(showResult)
        }else{
            res.status(400).json({message: "Unauthorize user"})
        }
        
         
     } catch (error) {
         next(error)
     }
  })
  module.exports = result;