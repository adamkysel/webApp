var temps = "<%= temps %>".split(",");
var hums = "<%= hums %>".split(",");
var soils1 = "<%= soils1 %>".split(",");
var soils2 = "<%= soils2 %>".split(",");
var soils3 = "<%= soils3 %>".split(",");
var soils4 = "<%= soils4 %>".split(",");
var datimes = "<%= datimes %>".split(",");

var ctx1 = document.getElementById('chartTemp').getContext('2d');
var chart1 = new Chart(ctx1, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: datimes,
    datasets: [{
        label: 'Teplota [°C]',
        backgroundColor: '#f8f814',
        borderColor: '#f8f814',
        data: temps
    }]
},
// Configuration options go here
options: {}
}); 
var humi;
var ctx2 = document.getElementById('chartHum').getContext('2d');
var chart2 = new Chart(ctx2, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: datimes,
    datasets: [{
        label: 'Vlhkosť [%]',
        backgroundColor: 'deepskyblue',
        borderColor: 'deepskyblue',
        data: hums
    }]
},
// Configuration options go here
options: {}
}); 
var soil;
var ctx3 = document.getElementById('chartSoil').getContext('2d');
var chart3 = new Chart(ctx3, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: datimes,
    datasets: [{
        label: 'Vlhkosť pôdy 1 [%]',
        fill: false,
        borderColor: 'yellow',
        backgroundColor: 'yellow',
        data: soils1
    },
    {
        label: 'Vlhkosť pôdy 2 [%]',
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'blue',
        data: soils2
    }]
    
},
// Configuration options go here
options: {}
}); 
var water;
var ctx4 = document.getElementById('chartWater').getContext('2d');
var chart4 = new Chart(ctx4, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: datimes,
    datasets: [{
        label: 'Vlhkosť pôdy 3 [%]',
        fill: false,
        borderColor: 'green',
        backgroundColor: 'green',
        data: soils2
    },{
        label: 'Vlhkosť pôdy 4 [%]',
        fill: false,
        borderColor: 'brown',
        backgroundColor: 'brown',
        data: soils2
    }]
},
// Configuration options go here
options: {}
}); 


$( "#button1" ).click(function() {
console.log('btn1');
$.ajax({
  url: '/control1',
  type: "POST",
  data: {
  },
  dataType: "json",
  success: function (data) {
      console.log(data);
      console.log("change door state");
  },
  error: function (error) {
      console.log(`Error ${error}`);
  }
});
});

$( "#button2" ).click(function() {
console.log('btn2');
$.ajax({
  url: '/control2',
  type: "POST",
  data: {
  },
  dataType: "json",
  success: function (data) {
      console.log(data);
      console.log("change window state");
  },
  error: function (error) {
      console.log(`Error ${error}`);
  }
});
});

$( "#button3" ).click(function() {
console.log('btn3');
$.ajax({
  url: '/control3',
  type: "POST",
  data: {
  },
  dataType: "json",
  success: function (data) {
      console.log(data);
      console.log("water");
  },
  error: function (error) {
      console.log(`Error ${error}`);
  }
});
});

$( "#doorSub" ).click(function() {
var timeo = document.getElementById("timeOpen1").value;
var timec = document.getElementById("timeClose1").value;
var mint = document.getElementById("minTemp1").value;
$.ajax({
  url: '/door_set',
  type: "POST",
  data: {
      open_time: timeo,
      close_time: timec,
      min_temp: mint
  },
  dataType: "json",
  success: function (data) {
      console.log(data);
  },
  error: function (error) {
      console.log(`Error ${error}`);
  }
});
});
$( "#windowSub" ).click(function() {
var timeo = document.getElementById("timeOpen2").value;
var timec = document.getElementById("timeClose2").value;
var mint = document.getElementById("minTemp2").value;
$.ajax({
  url: '/window_set',
  type: "POST",
  data: {
      open_time: timeo,
      close_time: timec,
      min_temp: mint
  },
  dataType: "json",
  success: function (data) {
      console.log(data);
  },
  error: function (error) {
      console.log(`Error ${error}`);
  }
});
});
$( "#waterSub" ).click(function() {
var soil = document.getElementById("minSoil").value;
var time = document.getElementById("waterTime").value;
$.ajax({
  url: '/water_set',
  type: "POST",
  data: {
      water_time: time,
      min_hum: soil
  },
  dataType: "json",
  success: function (data) {
      console.log(data);
  },
  error: function (error) {
      console.log(`Error ${error}`);
  }
});
});

setInterval(function() {
$.ajax({
    url: '/state1',
    type: "GET",
    dataType: "json",
    success: function (data) {
      var opt1 = document.getElementById("timeOpen1").value;
      var opt2 = document.getElementById("timeOpen2").value;
      var clt1 = document.getElementById("timeClose1").value;
      var clt2 = document.getElementById("timeClose2").value;
      var mint1 = document.getElementById("minTemp1").value;
      var mint2 = document.getElementById("minTemp2").value;
      var wat = document.getElementById("waterTime").value;
      var minh = document.getElementById("minSoil").value;
      
      document.getElementById("timeOpe1").innerHTML = data.opTime1;
      document.getElementById("timeClos1").innerHTML = data.clTime1; 
      document.getElementById("minTem1").innerHTML = data.minTemp1;
      document.getElementById("timeOpe2").innerHTML = data.opTime2;
      document.getElementById("timeClos2").innerHTML = data.clTime2;
      document.getElementById("minTem2").innerHTML = data.minTemp2;
      document.getElementById("waterTim").innerHTML = data.waTime;
      document.getElementById("minSoi").innerHTML = data.minSoil;
      

      if(data.motor1 === "open"){
        document.getElementById("motor1").innerHTML = "otvorené";
        document.getElementById("button1").innerHTML = "Zavrieť";
      }
      if(data.motor1 === "close"){
        document.getElementById("motor1").innerHTML = "zatvorené";
        document.getElementById("button1").innerHTML = "Otvoriť";
      }
      if(data.motor2 === "open"){
        document.getElementById("motor2").innerHTML = "otvorené";
        document.getElementById("button2").innerHTML = "Zavrieť";
      }
      if(data.motor2 === "close"){
        document.getElementById("motor2").innerHTML = "zatvorené";
        document.getElementById("button2").innerHTML = "Otvoriť";
      }
        console.log(data);
    },
    error: function (error) {
        console.log(`Error ${error}`);
    }
});

}, 2000);