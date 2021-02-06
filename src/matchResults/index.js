const express =require('express');
const ResultModel = require("./Schema");
const result = express.Router();
const q2m = require("query-to-mongo");
const {
    authorize,
    adminOnlyMiddleware
  } = require("../middlewares/authorize");
  
  result.get("/",  async (req, res, next)=>{
     try {
        const showResult = await ResultModel.find(req.query);
        if(showResult){
            res.status(200).send({results: showResult, Total: showResult.length})
        }else{
            res.status(400).json({message: "Bad request"})
        }      
     } catch (error) {
         next(error)
     }
  })
  result.get("/:gameDate",  async (req, res, next)=>{
    try {
        
       const showResult = await ResultModel.find({
           "gameDate":{
               $gte: new Date((new Date().getTime()-(15*24*60*60*1000)))
           }
       }).sort({"gameDate": -1});
       if(showResult){
        res.status(200).send({results: showResult, Total: showResult.length})
       }else{
           res.status(404).json({message: "Date not found"})
       }
       
        
    } catch (error) {
        next(error)
    }
 })
  result.get("/:id",  async (req, res, next)=>{
    try {
       const showResult = await ResultModel.findById(req.params.id)
       if(showResult){
           res.status(200).send(showResult)
       }else{
           res.status(404).json({message: "Match id inavlid"})
       }
       
        
    } catch (error) {
        next(error)
    }
 })
  result.post("/", authorize, adminOnlyMiddleware,async(req, res, next)=>{
     try {
         const checkFixtureId = await ResultModel.find({
            fixtureId: req.body.fixtureId
         });
         console.log(checkFixtureId);
         
         if(checkFixtureId.length !==0){
             res.status(409).send("Record already exist!")
         }else{
             const newMatchResult = new ResultModel(req.body);
             await newMatchResult.save();
             res.status(201).send("record Uploaded")
         }
         
     } catch (error) {
         next(error)
     }
  });
  result.put("/:id",  async (req, res, next) => {
    try {
      const updateMatchResult  = await ResultModel.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (updateMatchResult ) {
        res.status(201).send(updateMatchResult );
      } else {
        const error = new Error(`Match Result with id ${req.params.id} not found`);
        error.httpStatusCode = 404;
        next(error);
      }
    } catch (error) {
      next(error);
    }
  });
  result.delete("/:id", async (req, res, next)=>{
      try {
          const deleteMatchResult = await ResultModel.findByIdAndDelete(req.params.id);
          if(deleteMatchResult){
            res.status(202).json({message: "Record deleted successfully"});
              
          }else{
            res.status(404).json({message: "Record id invalid"});     
          }    
      } catch (error) {
          next(error);
      }
  })
  module.exports = result;