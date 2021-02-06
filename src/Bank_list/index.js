const express = require("express");
const bankRouter = express.Router();

const BankModel = require("./Schema");
const { authorize, adminOnlyMiddleware } = require("../middlewares/authorize");

bankRouter.get("/", async (req, res, next) => {
  try {
    const bankDetails = await BankModel.find(req.query);
    if (bankDetails) {
      res.status(200).send({ bank: bankDetails, Total: bankDetails.length });
    } else {
      res.status(400).json({ message: "unable to get bank details" });
    }
  } catch (error) {
    next(error);
  }
});
bankRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const bankDetailsId = await BankModel.findById(id);

    if (bankDetailsId) {
      res.status(200).send(bankDetailsId);
    }
    res.status(404).json({ message: `bank with ${id} is not Found` });
  } catch (error) {
    next(error);
  }
});
bankRouter.post(
  "/",

  authorize,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newBank = new BankModel({
        ...req.body,
      });
      const savedBank = await newBank.save();
      if (savedBank) {
        res.status(201).send(newBank._id);
      } else {
        res.status(400).json({ message: "Please check the body and re-post" });
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);
bankRouter.put(
  "/:id",
  adminOnlyMiddleware,
  authorize,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const updateBank = await BankModel.findByIdAndUpdate(id, req.body);
      if (updateBank) {
        res.status(200).send("acount updated successfully");
      } else {
        res.status(200).json({ message: `User with ${id} not Found` });
      }
    } catch (error) {
      next(error);
    }
  }
);
bankRouter.delete(
  "/:id",
  adminOnlyMiddleware,
  authorize,
  async (req, res, next) => {
    const id = req.params.id;
    const deleteBank = await BankModel.findByIdAndDelete(id);
    if (deleteBank) {
      res.status(200).send("Record deleted successfully");
    } else {
      res.status(404).send(`Record with id ${id} is not found`);
    }
  }
);

module.exports = bankRouter;
