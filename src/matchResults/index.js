const express =require('express');
const ResultModel = require("./Schema");
const result = express.Router();
  
  result.get("/",  async (req, res, next)=>{
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
  result.post("/",async(req, res, next)=>{
      try {
        const newMatchResult = new ResultModel({
            ...req.body
            
        });
        const savedMatchResult = await newMatchResult.save();
        if(savedMatchResult ){
            res.status(201).send(savedMatchResult );
        }else{
            res.status(404).json({message: "Please check match result"});
        }
          
      } catch (error) {
          next(error);
      }
      
  })
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