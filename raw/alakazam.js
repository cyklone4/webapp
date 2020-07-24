var express = require('express');
var router = express.Router();
var mysql = require('mysql');

class holder{
    constructor(val){
        this.seats = val
    }
    set valv(x){
      this.seats = x
    }
}

const p = new holder();
// cloud RTDB
var firebase = require("firebase");
firebase.initializeApp({
  databaseURL: "https://ad-webapp-ee28e.firebaseio.com/"
});

var dbRef = firebase.database().ref("users");

console.log("t", fun())
function fun(){
   dbRef.on("value", function(snapshot)
   {
       
       p.val = 0;
      var count =0;
    snapshot.forEach(function(childSnapshot){
        const isviolate=  childSnapshot.val().isviolate;
        // console.log (childcount);
        if (isviolate=='true'){
         p.val++;
      }
      

    })
    p.valv = p.val
    console.log(p.val);
    console.log("seats",p.seats)
    return p.seats
   })
  
}