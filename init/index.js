const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../Model/Listing");

main()
  .then(() => {
    console.log("connect succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderLust");
}

const init = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data inserted");
};

init();
