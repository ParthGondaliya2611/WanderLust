const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose.connect("mongodb://localhost:27017/wanderLust").then(() => {
    console.log("connect succesfull");
  });
};

module.exports = connectdb;
