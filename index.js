const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/goro', (req, res) => {
    var Cloudant = require('@cloudant/cloudant');
    var cloudant = Cloudant({ username:'a5fece7f-3038-48f1-ac5b-87aec575ffae-bluemix', password:'ee60e0c476522a2f1f0a365be212c45827f41f428a41e21b6b2f44deaf09c2e6', url:'https://a5fece7f-3038-48f1-ac5b-87aec575ffae-bluemix:ee60e0c476522a2f1f0a365be212c45827f41f428a41e21b6b2f44deaf09c2e6@a5fece7f-3038-48f1-ac5b-87aec575ffae-bluemix.cloudantnosqldb.appdomain.cloud' });
    var db = cloudant.db.use('diplo1423')
    var hums = [];
    var temps = [];
    /*db.insert({ _id: 'motor1',_rev: '2-25c59eb0ad7f88b92c840f582ae3709a', state: 'open'}, function (err, body) {
      if (err) {
        console.log(err)
      } else {
        console.log(body)
      }
    })*/
    db.list(async function (err, body) {
      if (err) {
        console.log(err)
      } else {
        //console.log(body)
        for(i=0;i<30;i++){
          await db.get(body.rows[i].id, async function(err, body) {
        
            if (!err && body.te !== null && body.te !== undefined)
            {
              temps.push(body.te);
              console.log(temps);
            }
              //console.log(typeof temps);
              //console.log(body.te);
          })
        }     
      }
    })

    //console.log(temps);
    setTimeout(function(){ res.render('pages/graph',{temp:temps}); }, 1800);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

