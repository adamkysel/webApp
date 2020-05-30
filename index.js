//default configuration for app
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
//cloudant configuration
var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant({ username:'a8319e14-276b-4500-9437-6012195a6c59-bluemix', password:'dd55554a1c9962c6c542656de61a2bea205555ac3cac1ca43c1d0991bb377e84', url:'https://a8319e14-276b-4500-9437-6012195a6c59-bluemix:dd55554a1c9962c6c542656de61a2bea205555ac3cac1ca43c1d0991bb377e84@a8319e14-276b-4500-9437-6012195a6c59-bluemix.cloudantnosqldb.appdomain.cloud' });
var db = cloudant.db.use('diplo')
var db_control = cloudant.db.use('diplo1423')
//MQTT.js configuration
var optio={
  qos:0};
options={
  clientId:"a:3151rw:koy5zpqjsr",
  username:"a-3151rw-koy5zpqjsr",
  password:"srjSpp@OESBBsy1K)S",
  clean:true};
var mqtt = require('mqtt')
//function to send command by MQTT protocol
function send_command(command){
  var client  = mqtt.connect('http://3151rw.messaging.internetofthings.ibmcloud.com', options)
  client.on("connect",function(){	
    console.log("connected");
    if (client.connected==true){
      console.log("publish");
      var message = command;
      client.publish("iot-2/type/Raspbe_P/id/Raspb/cmd/command/fmt/json", message,optio)
      client.end();
    }
  })
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded())
  .set('views', path.join(__dirname, 'views'))
  //set template engine for views
  .set('view engine', 'ejs')
  //routes
  .get('/', (req, res) => {
    //define arrays for sending to views
    var hums = [];
    var temps = [];
    var soils1 = [];
    var soils2 = [];
    var soils3 = [];
    var soils4 = [];
    var datimes = [];

    db.list(function (err, body) {
      if (err) {
        console.log(err)
      } else {
        console.log(body)
        //get last 10 documents data to graphs
        for(i=body.total_rows-10;i<body.total_rows;i++){
          console.log(body.total_rows)
          db.get(body.rows[i].id, async function(err, body) {
            if (!err && body.temperature !== null && body.temperature !== undefined)
            {
              temps.push(body.temperature);
              console.log(temps);
            }

            if (!err && body.humidity !== null && body.humidity !== undefined)
            {
              hums.push(body.humidity);
              console.log(hums);
            }

            if (!err && body.soil1 !== null && body.soil1 !== undefined)
            {
              soils1.push(body.soil1);
              console.log(soils1);
            }

            if (!err && body.soil2 !== null && body.soil2 !== undefined)
            {
              soils2.push(body.soil2);
              console.log(soils2);
            }
            if (!err && body.soil3 !== null && body.soil3 !== undefined)
            {
              soils3.push(body.soil3);
              console.log(soils3);
            }
            if (!err && body.soil4 !== null && body.soil4 !== undefined)
            {
              soils4.push(body.soil4);
              console.log(soils4);
            }
            if (!err && body.datetime !== null && body.datetime !== undefined)
            {
              datimes.push(body.datetime);
              console.log(datimes);
              //const sorted = datimes.sort();
              //console.log(sorted);
            }
          })
        }     
      }
    })
    //render view and send data to view timeout is for getting data from db
    setTimeout(function(){ res.render('pages/graph',
    { temps:temps, 
      hums:hums,
      datimes:datimes,
      soils1:soils1, 
      soils2:soils2, 
      soils3:soils3, 
      soils4:soils4}); }, 1800);
  })
 //route for change state of door
  .post('/control1', (req, res) => {
    db_control.get('door',async function(err, body){
      if(body.state ==='open'){
        var mess = { 
          _id : body._id,
          _rev: body._rev,
          state : "close",
          open_time : body.open_time,
          close_time : body.close_time,
          min_temp : body.min_temp }
        var message = JSON.stringify(mess);
        send_command(message);
      }

      if(body.state ==='close'){
        var mess = { 
          _id : body._id,
          _rev: body._rev,
          state : "open",
          open_time : body.open_time,
          close_time : body.close_time,
          min_temp : body.min_temp }
        var message = JSON.stringify(mess);
        send_command(message);
      }
      res.sendStatus(200)
    })
  })
  //route for change state of window
  .post('/control2', (req, res) => {
    db_control.get('window',async function(err, body){
      if(body.state ==='open'){
        var mess = { 
          _id : body._id,
          _rev: body._rev,
          state : "close",
          open_time : body.open_time,
          close_time : body.close_time,
          min_temp : body.min_temp }
        var message = JSON.stringify(mess);
        send_command(message);
      }

      if(body.state ==='close'){
        var mess = { 
          _id : body._id,
          _rev: body._rev,
          state : "open",
          open_time : body.open_time,
          close_time : body.close_time,
          min_temp : body.min_temp }
        var message = JSON.stringify(mess);
        send_command(message);
      }
      res.sendStatus(200)
    })
  })
  //route for starting water in greenhouse
  .post('/control3', (req, res) => {
    var mess = {_id:"dowater"}
    var message = JSON.stringify(mess);
    send_command(message);
    res.sendStatus(200)
  })
  // route for getting the last changed data from db
  .get('/state1', (req, res) => {
    var motor1 = "";
    var opTime1;
    var clTime1;
    var minTemp1;
    var motor2 = "";
    var opTime2;
    var clTime2;
    var minTemp2;
    var waTime;
    var minSoil;

    db_control.get('door',async function(err, body){
      motor1 = body.state;
      opTime1 = body.open_time;
      clTime1 = body.close_time;
      minTemp1 = body.min_temp;
    })
    db_control.get('window',async function(err, body){
      motor2 = body.state;
      opTime2 = body.open_time;
      clTime2 = body.close_time;
      minTemp2 = body.min_temp;
    })
    db_control.get('water',async function(err, body){
      waTime = body.water_time;
      minSoil = body.min_hum;
    })

    console.log(motor1)
    console.log(motor2)
    setTimeout(function(){ res.send({
      motor1 : motor1,
      motor2 : motor2,
      opTime1 : opTime1,
      opTime2 : opTime2,
      clTime1 : clTime1,
      clTime2 : clTime2,
      minTemp1 : minTemp1,
      minTemp2 : minTemp2,
      waTime : waTime,
      minSoil : minSoil
    }); }, 2000);})
    //route for sneding data from door card
    .post('/door_set', (req, res) => {
      var optime = req.body.open_time;
      var cltime = req.body.close_time;
      var te = req.body.min_temp;
      var id;
      var rev;
      var state;
      db_control.get('door',async function(err, body){
        id = body._id;
        rev = body._rev;
        state = body.state;
      })
      setTimeout(function(){
        var mess = { _id : id, _rev: rev, state : state, open_time : optime, close_time : cltime, min_temp : te }
        var message = JSON.stringify(mess);
        send_command(message);
        res.sendStatus(200)
      },1000)
    })
    //route for sneding data from window card
    .post('/window_set', (req, res) => {
      var optime = req.body.open_time;
      var cltime = req.body.close_time;
      var te = req.body.min_temp;
      var id;
      var rev;
      var state;
      db_control.get('window',async function(err, body){
        id = body._id;
        rev = body._rev;
        state = body.state;
      })
      setTimeout(function(){
        var mess = { _id : id, _rev: rev, state : state, open_time : optime, close_time : cltime, min_temp : te }
        var message = JSON.stringify(mess);
        send_command(message);
        res.sendStatus(200)
      },1000)
    })
    //route for sneding data from water card
    .post('/water_set', (req, res) => {
      console.log(req.body);
      var time = req.body.water_time;
      var humid = req.body.min_hum;
      var id;
      var rev;
      //get id and rev of document to send Raspberry Pi for update document in db
      db_control.get('water',async function(err, body){
        id = body._id;
        rev = body._rev;
      })
      setTimeout(function(){
        var mess = { _id : id, _rev: rev, water_time : time, min_hum : humid };
        var message = JSON.stringify(mess);
        send_command(message);
        res.sendStatus(200)
      },1000)
    })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
