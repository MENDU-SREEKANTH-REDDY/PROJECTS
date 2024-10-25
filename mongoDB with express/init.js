//adding data
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let allchats=[
{
  from: "zenitsu",
  to: "nezuko",
  msg: "kawaiiii",
  created_at: new Date(),
},

{
    from: "kira",
    to: "L",
    msg: "i won L its my perfect victory",
    created_at: new Date(),
  },

  {
    from: "devara",
    to: "saif",
    msg: "devara seppadante adigadu ani",
    created_at: new Date(),
  },


]

Chat.insertMany(allchats);