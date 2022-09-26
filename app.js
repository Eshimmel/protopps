const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const PORT = 4000;

var file = "./db/league.db"
var db = new sqlite3.Database(file);
var row = []

app.set('views', __dirname + '/views')
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))



// Endpoints
app.get('/', (req, res) => {
  res.redirect('/addplayer')
})

app.get('/addplayer', (req, res) => {
  res.render('add', {

  })
})


app.post('/addplayer', (req, res) => {
  if (req.body.player && req.body.team && req.body.salary && req.body.years && req.body.fast && req.body.change && req.body.off) {
    // Get player details
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
    // Add player to database
    db.run("INSERT INTO players (name, salary, years, fast, change, off) VALUES (?, ?, ?, ?, ?, ?)",
      [player.name, player.salary, player.years, player.stats.fastball, player.stats.change, player.stats.offspeed])
    // Find players team or create new team
    db.get('SELECT * FROM teams WHERE team=?', [player.team], (err, teamName) => {
      if (err) {
        console.log(err);
      }
      teamName = teamName.team
      // Check if team has already been created
      if (teamName == player.team) {
        // Find team ID
        db.get(`SELECT id FROM teams WHERE team=?`, [player.team], (err, tid) => {
          // Find player ID
          db.get(`SELECT id FROM players WHERE name=?`, [player.name], (err, pid) => {
            // Connect player and team using roster table
            db.run(`INSERT INTO roster(tid, pid) VALUES(?, ?)`,
              [tid, pid], (err) => {
                if (err) {
                  console.log(err);
                }
                console.log('Player added to team');
              })
          })
        })
      } else {
        // Create new team
        db.run(`INSERT INTO teams(team, cash) VALUES(?, ?)`,
          [player.team, 50], (err) => {
            if (err) {
              console.log(err);
            }
          })
        // Find team ID
        db.get(`SELECT id FROM teams WHERE team=?`, [player.team], (err, tid) => {
          // Find user ID
          db.get(`SELECT id FROM players WHERE name=?`, [player.name], (err, pid) => {
            // Connect player and team using roster table
            db.run(`INSERT INTO roster(tid, pid) VALUES(?, ?)`,
              [tid.id, pid.id], (err) => {
                if (err) {
                  console.log(err);
                }
                console.log('Player added to team');
              })
          })
        })
      }
    })
  } else {
    res.send("Fail")
  }
  console.log(player);
  res.send("Success")

})

app.get('/teams', (req, res) => {
    
})



app.listen(PORT, function () {
  console.log("Listening on port: " + PORT);
})
