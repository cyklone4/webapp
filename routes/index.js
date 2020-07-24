var express = require('express');
var router = express.Router();

class users{
  constructor(occupiedSeats,totalSeats,violators){
    this.occupiedSeats = occupiedSeats;
    this.totalSeats = totalSeats;
    this.violators = violators;
  }
}

// cloud RTDB
var firebase = require("firebase");
firebase.initializeApp({
  databaseURL: "https://ad-webapp-ee28e.firebaseio.com/"
});

var dbRef = firebase.database().ref("users");



/* GET home page. */
router.get('/', function(req, res, next) {

  const allLocation = new users();
  allLocation.totalSeats = 100;
  allLocation.violators = 0;
  dbRef.once('value').then(snap => {                          
        allLocation.occupiedSeats = snap.numChildren()
        snap.forEach(function(childSnapshot){
          const isviolate = childSnapshot.val().isviolate;
          if(isviolate=='true'){
            allLocation.violators++;
          }
        })
        console.log("before haha", allLocation)
        console.log("hahaha")

        res.render('index',{js:'/javascripts/plot.js',
                            loc:'All Regions',
                            seatsOccupied:allLocation.occupiedSeats,
                            availableSeats:allLocation.totalSeats,
                            violators:allLocation.violators,
                            totalSeats:allLocation.totalSeats
                            });
        
})

console.log(allLocation.totalSeats, allLocation.violators, allLocation.occupiedSeats);

console.log("sent");
});



function tester(cafeteria,res){
  console.log("aller",cafeteria);
  
  dbRef.once('value').then(snap => {         
    cafeteria.violators=0;                 
    cafeteria.occupiedSeats = snap.numChildren()
    snap.forEach(function(childSnapshot){
      const isviolate = childSnapshot.val().isviolate;
      if(isviolate=='true'){
        cafeteria.violators++;
      }
    } )
    
    console.log("before sending aller", cafeteria)
    cafeteria.seatsocc = cafeteria.seatsOccupied
    
    return cafeteria.violators
    
})

console.log("before sending aller v2", cafeteria)



// return aller;
}




// code for the dropdown
router.get('/cafe',function(req,res,next){
  console.log("calling cafeteria")
  const cafeteria = new users(0,0,0);

  dbRef.once('value').then(snap => {

    cafeteria.totalSeats = 40;
    cafeteria.occupiedSeats = 0;
    cafeteria.violators = 0;

    snap.forEach(function(childSnapshot,req,res){
      const isviolate = childSnapshot.val().isviolate;
      const loc = childSnapshot.val().beaconLocation;
      if(loc=='cafeteria'){
        cafeteria.occupiedSeats++;
        if(isviolate=='true'){
          cafeteria.violators++;
         }
      }
    })
    console.log("logger me this #@$#@ :", cafeteria.violators );
    // console.log("occupied seats :", occupiedSeats);
  res.render('index',{js:'/javascripts/plot.js',
  loc:'Cafeteria',
  seatsOccupied: cafeteria.occupiedSeats,
  availableSeats: cafeteria.totalSeats,
  totalSeats:cafeteria.totalSeats,
  violators:cafeteria.violators

});

})

});
module.exports = router;