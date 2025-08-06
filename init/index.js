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
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "687cbc0879379b5de2b7d603",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data inserted");
};

init();
