var express = require('express');
var router = express.Router();

router.param('team', function(req, res, next, team) {
  if (team != "Green" && team != "Red" && team != "Blue") {
    res.send("Invalid team");
  }
  req.team = team;
  next();
})

router.get('/:team', function(req, res, next) {
  res.render('game_board', {"team": req.team});
});

module.exports = router;
