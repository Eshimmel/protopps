const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();

const PORT = 4000;

var file = "./db/league.db"
var row = []

app.set('views', __dirname + '/views')
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.redirect('/addplayer')
})

app.get('/addplayer', (req, res) => {
    res.render('add', {

    })
})


app.post('/addplayer', (req, res) => {
  if (req.body.player && req.body.team && req.body.salary && req.body.years && req.body.fast && req.body.change && req.body.off) {
  var player = {
    name: req.body.player,
    team: req.body.team,
    salary: req.body.salary,
    years: req.body.years,
    stats: {
      fastball: req.body.fast,
      change: req.body.change,
      offspeed: req.body.off
    }
  }
    var db = new sqlite3.Database(file);
    db.run("INSERT INTO players (name, team, salary, years, fast, change, off) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [player.name, player.team, player.salary, player.years, player.stats.fastball, player.stats.change, player.stats.offspeed])
    db.close(console.log('Wrote'));
  } else {
      res.send("Fail")
  }
  console.log(player);
    res.send("Success")

})

app.get('/teams', (req, res) => {
  var db = new sqlite3.Database(file);
  db.all("SELECT * FROM players ORDER BY team", (err, rows) => {
    row = rows
    if (err) {
      console.log(err)
    }
    db.close();
    res.render('teams', {
      rows: row
    })
  })
})


app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
})
