const express = require('express');
const accountRouter = express.Router();

const AccountModel = require("./Schema");
const {
    authorize,
    adminOnlyMiddleware
  } = require("../middlewares/authorize");

accountRouter.get("/", authorize, async (req, res, next)=>{
  try {
    const accountDetails = await AccountModel.find(req.query);
    if(accountDetails){
      res.status(200).send({account: accountDetails, Total: accountDetails.length});
    }else{
      res.status(400).json({message: "unable to get account details"});
    }
    
  } catch (error) {
    next(error)
  }
  
});
accountRouter.get("/:id", authorize, async (req, res, next)=>{
  try {
    const id = req.params.id;
  const accountDetailsId = await AccountModel.findById(id);
  
  if(accountDetailsId){
    res.status(200).send(accountDetailsId);
  }
  res.status(404).json({message: `Account with ${id} is not Found`});
    
  } catch (error) {
    next(error)
  }
  
  
});
accountRouter.post('/',authorize, async (req,res) => {
    try{
      const newAccount = new AccountModel({...req.body});
      const savedAccount = await newAccount.save();
      if(savedAccount){
        res.status(201).send(newAccount._id);
        
      }else{
        res.status(400).json({message: "Please check the body and re-post"});
      } 
    } catch(err) {
      console.error(err)
      next(err)
    }
});
accountRouter.put("/:id", authorize, async (req, res, next)=>{
  try {
    const id = req.params.id
    const updateAccount = await AccountModel.findByIdAndUpdate(id, req.body);
    if (updateAccount){
      res.status(200).send("acount updated successfully");
    }else{
      res.status(200).json({message:`User with ${id} not Found`});
    }
  } catch (error) {
    next(error); 
  }
  
});
accountRouter.delete("/:id", authorize, async (req, res, next)=>{
  const id = req.params.id
  const deleteAccount = await AccountModel.findByIdAndDelete(id);
  if(deleteAccount){
    res.status(200).send("Record deleted successfully");
  }else{
    res.status(404).send(`Record with id ${id} is not found`);
  }
  
});


module.exports = accountRouter;