const express =require('express');
const ResultModel = require("./Schema");

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
  result.post("/",authorize, adminOnlyMiddleware, async(req, res, next)=>{
      try {
          
      } catch (error) {
          next(error);
      }
      
  })
  result.delete("/:id", authorize, adminOnlyMiddleware, async (req, res, next)=>{
      try {
          const deleteMatchResult = await ResultModel.findByIdAndDelete(req.params.id);
          if(deleteMatchResult)
            res.status(202).json({message: "Record deleted successfully"})
          
      } catch (error) {
          next(error);
      }
  })
  module.exports = result;