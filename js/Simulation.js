var simulationData = {};
simulationData.teams = [];

function onOpen() {
  createTeams();
  setDefaultValues();
}

function createTeams() {
  simulationData.teams[0] = createTeamOne();
  simulationData.teams[1] = createTeamTwo();
}

function createTeamOne() {
  return {
    firstPlayerNumber: 1,
    lastPlayerNumber: 9,
    batters: [],
    pitcher: {},
    currentHitterId: 0,
    score: 0,
    gameRecord: 0,
    name: 'Team1'
  }
}

function createTeamTwo() {
  return {
    firstPlayerNumber: 10,
    lastPlayerNumber: 18,
    batters: [],
    pitcher: {},
    currentHitterId: 0,
    score: 0,
    gameRecord: 0,
    name: 'Team2'
  }
}

function teamOne() {
  return simulationData.teams[0];
}

function teamTwo() {
  return simulationData.teams[1];
}

function getLineup(team) {
  var batterStats = [];
  for (var currentPlayerNumber = team.firstPlayerNumber; currentPlayerNumber <= team.lastPlayerNumber; currentPlayerNumber++){
    var plateappearances = parseInt(document.getElementById('plateAppearanceBoxid'+currentPlayerNumber).value);
    var hits = parseInt(document.getElementById('hitsBoxid'+currentPlayerNumber).value);
    var doubles = parseInt(document.getElementById('doublesBoxid'+currentPlayerNumber).value);
    var triples = parseInt(document.getElementById('triplesBoxid'+currentPlayerNumber).value);
    var homeruns = parseInt(document.getElementById('homeRunBoxid'+currentPlayerNumber).value);
    var walks = parseInt(document.getElementById('baseOnBallBoxid'+currentPlayerNumber).value);
    var atbats = plateappearances - walks;
    var battingAverage = hits/atbats;
    var obp = (hits+walks)/plateappearances;
    var slg = ((hits - doubles - triples - homeruns)+(2*doubles) + (3*triples) + (4*homeruns))/atbats;
    var iso = slg/battingAverage;
    if(!checkBatterStats(battingAverage,obp)) {
      lineupFailure();
      return false;
    }
    batterStats.push({
      doubles: doubles,
      triples: triples,
      hits: hits,
      atbats: atbats,
      plateappearances: plateappearances,
      walks: walks,
      homeruns: homeruns,
      battingaverage: battingAverage,
      onbasepercentage: obp,
      sluggingpercentage: slg,
      iso: iso,
      strikeouts: 1,
      hitsincurrentsim: 0,
      atbatsincurrentsim:0,
      name: "Steve Stevenson",
    });
  }
  var pitcherStats;
  var eraL = document.getElementById('eraBoxid'+team.name).value;
  var whipL = document.getElementById('whipBoxid'+team.name).value;
  pitcherStats = {
    whip: whipL,
    era: eraL,
  };

  team.batters = batterStats;
  team.pitcher = pitcherStats;
}
function setToReference(teamNum){
  var team = simulationData.teams[teamNum-1];
  var pa  = document.getElementById('plateAppearanceBox'+team.name).value;
  var hit = document.getElementById('hitsBox'+team.name).value;
  var dbl = document.getElementById('doublesBox'+team.name).value;
  var tpl = document.getElementById('triplesBox'+team.name).value;
  var hr  = document.getElementById('homeRunBox'+team.name).value;
  var bb  = document.getElementById('baseOnBallBox'+team.name).value;
  var era  = document.getElementById('eraBox'+team.name).value;
  var whip  = document.getElementById('whipBox'+team.name).value;

  for (var currentPlayerNumber = team.firstPlayerNumber; currentPlayerNumber <= team.lastPlayerNumber; currentPlayerNumber++) {
    document.getElementById('plateAppearanceBoxid'+currentPlayerNumber).value = pa;
    document.getElementById('hitsBoxid'+currentPlayerNumber).value = hit;
    document.getElementById('doublesBoxid'+currentPlayerNumber).value = dbl;
    document.getElementById('triplesBoxid'+currentPlayerNumber).value = tpl;
    document.getElementById('homeRunBoxid'+currentPlayerNumber).value = hr;
    document.getElementById('baseOnBallBoxid'+currentPlayerNumber).value = bb;
  }
  document.getElementById('eraBoxid'+team.name).value = era;
  document.getElementById('whipBoxid'+team.name).value = whip;
}

function setReferenceValues(team){
  var teamId = team.name;
  document.getElementById('plateAppearanceBox'+teamId).value = 600;
  document.getElementById('hitsBox'+teamId).value = 134;
  document.getElementById('doublesBox'+teamId).value = 27;
  document.getElementById('triplesBox'+teamId).value = 3;
  document.getElementById('homeRunBox'+teamId).value = 16;
  document.getElementById('baseOnBallBox'+teamId).value = 55;
  document.getElementById('eraBox'+team.name).value = 4.02;
  document.getElementById('whipBox'+team.name).value = 1.32;

}

function setToLeagueAverage(teamID){
  setToStartingValues(simulationData.teams[teamID-1]);
}

function setToStartingValues(team) {
  for (var currentPlayerNumber = team.firstPlayerNumber; currentPlayerNumber <= team.lastPlayerNumber; currentPlayerNumber++) {
    document.getElementById('plateAppearanceBoxid'+currentPlayerNumber).value = 600;
    document.getElementById('hitsBoxid'+currentPlayerNumber).value = 134;
    document.getElementById('doublesBoxid'+currentPlayerNumber).value = 27;
    document.getElementById('triplesBoxid'+currentPlayerNumber).value = 3;
    document.getElementById('homeRunBoxid'+currentPlayerNumber).value = 16;
    document.getElementById('baseOnBallBoxid'+currentPlayerNumber).value = 55;
  }
  document.getElementById('eraBoxid'+team.name).value = 4.02;
  document.getElementById('whipBoxid'+team.name).value = 1.32;
}

function setDefaultValues() {
  for(var team of simulationData.teams) {
    setToStartingValues(team)
    setReferenceValues(team);
  }

  document.getElementById("gamesToSimNumid").value = 162;
  clearGameRecord();
}

function updateRecord(winningTeam) {
  winningTeam.gameRecord++;
}

function clearGameRecord() {
  for(var team of simulationData.teams) {
    team.gameRecord = 0;
  }
  renderGameRecord();
}

function renderGameRecord() {
  var teamOneRecord = teamOne().gameRecord;
  var teamTwoRecord = teamTwo().gameRecord;
  document.getElementById('gameRecord').value = `${teamOneRecord}-${teamTwoRecord}`;
}

<<<<<<< HEAD
=======
function simulateSingleGame(){
  var currentGames = document.getElementById('gamesToSimNumid').value;
  document.getElementById('gamesToSimNumid').value = 1;
  simulateMultGame();
  document.getElementById('gamesToSimNumid').value = currentGames;

}

>>>>>>> parent of c3af93e... Add baseballSim
function simulateMultGame(){
  var simStats = {
    runs1: [],
    runs2: [],
    games: document.getElementById('gamesToSimNumid').value
  }
  if(!isNumber(simStats.games))
    simStats.games = 1;
  NProgress.start();
  for(var gamenum=0;gamenum<simStats.games;gamenum++){
    simulateGame();
    simStats.runs1.push(teamOne().score);
    simStats.runs2.push(teamTwo().score);
    NProgress.inc();
  }
  NProgress.done();
  renderGameRecord();
  var allRuns = simStats.runs1.concat(simStats.runs2);
  var allRunAv = average(allRuns);
  var r1Av = average(simStats.runs1);
  var r2Av = average(simStats.runs2);
  document.getElementById('team1Score').value = r1Av.toFixed(2);
  document.getElementById('team2Score').value = r2Av.toFixed(2);

  clearHists();
  makeHisto(simStats.runs1,"Team 1 Score","imageOut");
  makeHisto(simStats.runs2,"Team 2 Score","imageOut2");
}

function average(inp) {
  var sum = 0;
  for(var i=0; i<inp.length; i++) {
    sum+=inp[i];
  }
  return (sum/inp.length);
}

function clearHists() {
  d3.selectAll("svg").remove();
}

function resetTeamsForGame(){
  teamOne().score = 0;
  teamOne().currentHitterId = 0;
  teamTwo().score = 0;
  teamTwo().currentHitterId = 0;
}

function simulateGame() {
  resetTeamsForGame();
  var inning = 1;
  while(inning <= 9 || (teamOne().score == teamTwo().score)) {
    for(var team of simulationData.teams) {
      var temp = runSimInning(team);
      if(temp == "exit") {
        alert("runSimInning Failed. Exit.");
        return;
      }
      team.score += temp.runs;
    }
    inning++;
  }
  if(teamOne().score > teamTwo().score)
  updateRecord(teamOne());
  if(teamOne().score < teamTwo().score)
  updateRecord(teamTwo());
}

function makeHisto(data,title,division) {
  d3.select("#"+division)
    .datum(data)
    .call(histogramChart(title)
    .bins(Math.max.apply(Math, data))
    .tickFormat(d3.format("0f")));
  $("svg").css({top: 20, left: 80, padding: 20, position:'relative'});
}

function getPitcher(team){
  var pitcher;
  if(team == teamOne())
    pitcher = teamTwo().pitcher;
  if(team == teamTwo())
    pitcher = teamOne().pitcher;
  return pitcher;
}

function runSimInning(team){
  var hitType=0;
  var baseState=[0,0,0];
  var batterStats = [];
  getLineup(team);
  var innStats = {
    hits: 0,
    runs: 0,
    outs: 0
  };

  var pitcher = getPitcher(team);

  while(innStats.outs < 3) {
    var battingAverage = team.batters[team.currentHitterId].battingaverage;
    var onBasePerc = team.batters[team.currentHitterId].onbasepercentage;
    team.batters[team.currentHitterId].atbatsincurrentsim++;
    if(simAtBat(onBasePerc,pitcher)) {
      innStats.hits++;
      hitType = determineHitType(team);
      innStats.runs += moveRunners(hitType, baseState);
      team.batters[team.currentHitterId].hitsincurrentsim++;
    } else {
      innStats.outs++;
    }
    if(++team.currentHitterId >= team.batters.length)
      team.currentHitterId = 0;
  }
  return innStats;
}

function lineupFailure() {
  clearHists();
}

function checkBatterStats(battingAverage,OBP) {
  if(0 > battingAverage || battingAverage >= 1 || 0 > OBP || OBP >= 1) {
    alert("Batting Average & On Base Percentage between (0,1) please.");
    return false;
  } else if (battingAverage > OBP){
    alert("OBP > BA for one batter");
    return false;
  } else {
    return true;
  }
}

function simAtBat(OBP,pitcher) {
  if(Math.random() < (OBP*(pitcher.whip/1.2))){ // Division by 1.2 used to tune the response to match observed league averages
    return true;
  }
  else{
    return false;
  }
}

function determineHitType(team) {
  var batter = team.batters[team.currentHitterId];
  var pitcher = getPitcher(team);
  var era = pitcher.era;

  var obp = batter.onbasepercentage;
  var batavg = batter.battingaverage;
  var slg = batter.sluggingpercentage;
  var dbl = batter.doubles;
  var trp = batter.triples;
  var hr  = batter.homeruns;
  var hits = batter.hits;
  var percentWalks = (obp-batavg)/obp;
  var hrOdds   = hr/hits;
  var tripOdds = trp/hits;
  var doubOdds = dbl/hits;

  // Add pitcher effect, tuned to match observed averages
  hrOdds = hrOdds*(era/4);
  tripOdds = tripOdds*(era/4);
  doubOdds = doubOdds*(era/4);

  if(checkIfWalk(percentWalks))
    return 1;

  var roll = Math.random();

  if(roll < hrOdds)
    return 4;
  if(roll < (hrOdds+tripOdds))
    return 3;
  if(roll < (hrOdds+tripOdds+doubOdds))
    return 2;
  else
    return 1;
}

function checkIfWalk(percentWalks) {
  if(Math.random() < percentWalks) {
    return true;
  } else {
    return false;
  }
}

function moveRunners(hit,baseState) {
  var runs=0;
  for(var i=0; i<hit; i++) {
    for(var base=2; base>=0; base--) {
      if(base == 2 && baseState[base] == 1) {
        runs++;
        baseState[base] = baseState[base-1];
      }
      if(base == 0 && i == 0)
        baseState[base] = 1;
      else if(base == 0)
        baseState[base] = 0;
      else
        baseState[base] = baseState[base-1];
      //alert(base+" "+baseState[base])
    }
  }
  return runs;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
