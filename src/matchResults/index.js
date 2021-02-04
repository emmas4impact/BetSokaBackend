const express =require('express');
const ResultModel = require("./Schema");
const result = express.Router();
const q2m = require("query-to-mongo");

  
  result.get("/",  async (req, res, next)=>{
     try {
        const showResult = await ResultModel.find(req.query);
        if(showResult){
            res.status(200).send(showResult)
        }else{
            res.status(400).json({message: "Unauthorize user"})
        }
        
         
     } catch (error) {
         next(error)
     }
  })
  result.get("/:gameDate",  async (req, res, next)=>{
    try {
        //const filterByDate =
       const showResult = await ResultModel.find(req.query);
       if(showResult){
           res.status(200).send(showResult)
       }else{
           res.status(400).json({message: "Unauthorize user"})
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
  result.post("/",async(req, res, next)=>{
     try {
         ResultModel.findOne({fixtureId}).exec((err, fixture_id)=>{
             if(fixture_id){
                const err = new Error("Duplicated Record")
                err.httpStatusCode = 409
                next(err)
             }else{
                 const newMatchResult = new ResultModel({...req.body});
                 const savedMatchResult = await newMatchResult.save();
                if(savedMatchResult ){
                    res.status(201).send(savedMatchResult);
                }else{
                    res.status(404).json({message: "Please check match result"});
                }
             }
         })
         
     } catch (error) {
         
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