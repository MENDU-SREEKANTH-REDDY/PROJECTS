
//require exp,faker,mysql,path(for templeting ejs),method-override,id
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
const { v4: uuidv4 } = require('uuid'); // Importing the UUID package
const methodOverride=require("method-override");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
//setting up ejs
app.set("view engine","ejs");
//making path to get info from viewa where the ejs is stored.
app.set("views",path.join(__dirname,"/views"));

//made connection to mysql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Nameofme1@'
});

//giving info of fake people(requiring from faker)
let getRandomUser = () => {
  return [
     faker.string.uuid(),
     faker.internet.userName(),
    faker.internet.email(),
     faker.internet.password()
  ];
};


//so this port GET "/" -> shows count of no. of users in table.
app.get("/",(req,res)=>{
  let q="SELECT count(*) FROM user";
  try {
    connection.query(q,(err, result) => {
      if (err) throw err;
      let count=result[0]["count(*)"];
      res.render("home.ejs",{count});
    });
  } catch (err) {
    console.log("Caught error:", err);
    res.send("some error occured");
  }
});


// to show all the data in table using showuser.ejs
app.get("/user",(req,res)=>{

  let q="SELECT * FROM user";
  try {
    connection.query(q,(err,users) => {
      if (err) throw err;
      
      res.render("showusers.ejs",{users});   
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }
});

//editing username using edit.ejs
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q= `SELECT * FROM user WHERE id='${id}'`
  try {
    connection.query(q,(err,result) => {
      if (err) throw err;
     let user = result[0];
      res.render("edit.ejs",{user});   
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }
});


//now upsating the username
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q= `SELECT * FROM user WHERE id='${id}'`;
  let { password: formpass, username: newUsername } = req.body;//
  try {
    connection.query(q,(err,result) => {
      if (err) throw err;
     let user = result[0];

     if(formpass != user.password){
    res.send("Wrong Password"); 

  }else
    {
    let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
    connection.query(q2,(err,result)=>{
      if (err) throw err;
      res.redirect("/user");
    });
  }
  
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }


});

//TO ADD NEW USER DATA
app.get("/user/new",(req,res)=>{
  res.render("add.ejs");
})
app.post("/user", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

//deleting data
app.delete("/user/:id",(req,res)=>{

  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});


app.listen("8080",()=>{

  console.log("server is listening to port 8080:");
});


