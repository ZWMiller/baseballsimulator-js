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
    pitchers: [],
    currentHitterId: 0,
    score: 0,
    gameRecord: 0
  }
}

function createTeamTwo() {
  return {
    firstPlayerNumber: 10,
    lastPlayerNumber: 18,
    batters: [],
    pitchers: [],
    currentHitterId: 0,
    score: 0,
    gameRecord: 0
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
    var atbats = parseInt(document.getElementById('atBatBoxid'+currentPlayerNumber).value);
    var hits = parseInt(document.getElementById('hitsBoxid'+currentPlayerNumber).value);
    var doubles = parseInt(document.getElementById('doublesBoxid'+currentPlayerNumber).value);
    var triples = parseInt(document.getElementById('triplesBoxid'+currentPlayerNumber).value);
    var homeruns = parseInt(document.getElementById('homeRunBoxid'+currentPlayerNumber).value);
    var walks = parseInt(document.getElementById('baseOnBallBoxid'+currentPlayerNumber).value);
    var battingAverage = hits/atbats;
    var obp = (hits+walks)/atbats;
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
  var pitcherStats = [];
  var whipL = 1;
  var eraL = 1;
  pitcherStats.push({
    whip: whipL,
    era: eraL,
  });

  team.batters = batterStats;
  team.pitchers = pitcherStats;
}

function setToAverage(team) {
  for (var currentPlayerNumber = team.firstPlayerNumber; currentPlayerNumber <= team.lastPlayerNumber; currentPlayerNumber++) {
    if(team == teamOne())
      {
        document.getElementById('atBatBoxid'+currentPlayerNumber).value = 533;
        document.getElementById('hitsBoxid'+currentPlayerNumber).value = 134;
        document.getElementById('doublesBoxid'+currentPlayerNumber).value = 27;
        document.getElementById('triplesBoxid'+currentPlayerNumber).value = 3;
        document.getElementById('homeRunBoxid'+currentPlayerNumber).value = 16;
        document.getElementById('baseOnBallBoxid'+currentPlayerNumber).value = 52;
      }
    if(team == teamTwo())
      {
        document.getElementById('atBatBoxid'+currentPlayerNumber).value = 533;
        document.getElementById('hitsBoxid'+currentPlayerNumber).value = 134;
        document.getElementById('doublesBoxid'+currentPlayerNumber).value = 35;
        document.getElementById('triplesBoxid'+currentPlayerNumber).value = 5;
        document.getElementById('homeRunBoxid'+currentPlayerNumber).value = 18;
        document.getElementById('baseOnBallBoxid'+currentPlayerNumber).value = 50;
      }
  }
}

function setDefaultValues() {
  for(var team of simulationData.teams) {
    setToAverage(team)
  }

  document.getElementById('numSimBoxid').value = 10;
  document.getElementById('numInnBoxid').value = 1000;
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

function runSimAtBat() {
  var simStats = {
    hits: 0,
    outs: 0,
    numSims: document.getElementById('numSimBoxid').value
  }
  getLineup(teamOne());
  var battingAverage = teamOne().batters[0].battingaverage;
  var onBasePerc = teamOne().batters[0].onbasepercentage;

  if(!checkBatterStats(battingAverage,onBasePerc)) return false;
  for(var i=0; i<simStats.numSims; i++) {
    if(simAtBat(onBasePerc))
      simStats.hits++;
    else
      simStats.outs++;
  };

  document.getElementById('numHitsBoxid').value = simStats.hits;
  document.getElementById('numOutsBoxid').value = simStats.outs;
  document.getElementById('numRunsBoxid').value = "X X X";
}

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
  document.getElementById('numHitsBoxid').value = "X X X";
  document.getElementById('numRunsBoxid').value = allRunAv.toFixed(2);
  document.getElementById('numOutsBoxid').value = "X X X";

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
      var temp = runSimInning(1,team);
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

function simMultInnings(team){
  runMultInnings(simulationData.teams[team-1]);
}

function runMultInnings(team) {
  var numInns = document.getElementById('numInnBoxid').value
  var runs = 0;
  var hits = 0;
  var hitLog = [];
  var runLog = [];
  var simCount = 0;
  for(var i=0; i<numInns; i++) {
    var temp = runSimInning(1,team);
    if(temp == "exit")
      return;
    hits += temp.hits;
    runs += temp.runs;
    hitLog.push(temp.hits);
    runLog.push(temp.runs);
    simCount++;
  }
  if(simCount > 0) {
    document.getElementById('numHitsBoxid').value = hits/simCount;
    document.getElementById('numRunsBoxid').value = runs/simCount;
    document.getElementById('numOutsBoxid').value = "X X X";
  } else {
    document.getElementById('numHitsBoxid').value = "X X X";
    document.getElementById('numRunsBoxid').value = "X X X";
  }
  clearHists();
  makeHisto(hitLog,"Hits in the Inning","imageOut");
  makeHisto(runLog,"Runs in the Inning","imageOut2");
}

function makeHisto(data,title,division) {
  d3.select("#"+division)
    .datum(data)
    .call(histogramChart(title)
    .bins(Math.max.apply(Math, data))
    .tickFormat(d3.format("0f")));
  $("svg").css({top: 20, left: 80, padding: 20, position:'relative'});
}

function runSimInning(mode,team)
{
  var hits=0;
  var outs=0;
  var runs=0;
  var hitType=0;
  var baseState=[0,0,0];
  var batterStats = [];
  getLineup(team);
  var innStats = {
    hits: 0,
    runs: 0,
    outs: 0
  };
  while(innStats.outs < 3) {
    var battingAverage = team.batters[team.currentHitterId].battingaverage;
    var onBasePerc = team.batters[team.currentHitterId].onbasepercentage;
    team.batters[team.currentHitterId].atbatsincurrentsim++;
    if(simAtBat(onBasePerc)) {
      innStats.hits++;
      hitType = determineHitType(team.batters[team.currentHitterId]);
      innStats.runs += moveRunners(hitType, baseState);
      team.batters[team.currentHitterId].hitsincurrentsim++;
    } else {
      innStats.outs++;
    }
    if(++team.currentHitterId >= team.batters.length)
      team.currentHitterId = 0;
  }
  if(mode == 1) {
    return innStats;
  }
  else {
    document.getElementById('numHitsBoxid').value = hits;
    document.getElementById('numOutsBoxid').value = outs;
    document.getElementById('numRunsBoxid').value = runs;
  }
}

function lineupFailure() {
  clearHists();
  document.getElementById('numHitsBoxid').value = "Invalid Lineup";
  document.getElementById('numOutsBoxid').value = "Invalid Lineup";
  document.getElementById('numRunsBoxid').value = "Invalid Lineup";
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

function simAtBat(OBP) {
  if(Math.random() < OBP)
    return true;
  else
    return false;
}

function determineHitType(batter) {
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
