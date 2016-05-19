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
    lastPlayerNumber: 9
  }
}

function createTeamTwo() {
  return {
    firstPlayerNumber: 10,
    lastPlayerNumber: 18
  }
}

function teamOne() {
  return simulationData.teams[0];
}

function teamTwo() {
  return simulationData.teams[1];
}

function setToAverage(team) {
  for (var currentPlayerNumber = team.firstPlayerNumber; currentPlayerNumber <= team.lastPlayerNumber; currentPlayerNumber++) {
    document.getElementById("batAverageBoxid"+currentPlayerNumber).value = 0.25;
    document.getElementById("onBasePercBoxid"+currentPlayerNumber).value = 0.3;
  }
}

function setDefaultValues() {
  for(var team of simulationData.teams) {
    setToAverage(team)
  }

  document.getElementById('numSimBoxid').value = 10;
  document.getElementById('numInnBoxid').value = 1000;
  clearGameRecord();
}

function updateRecord(winningTeam) {
  winningTeam.gameRecord++;

  renderGameRecord();
}

function clearGameRecord() {
  for(var team of simulationData.teams) {
    team.gameRecord = 0;
  }
  renderGameRecord();
}

function renderGameRecord() {
  teamOneRecord = teamOne().gameRecord;
  teamTwoRecord = teamTwo().gameRecord;
  document.getElementById('gameRecord').value = `${teamOneRecord}-${teamTwoRecord}`;
}

function runSimAtBat() {
  var hits=0;
  var outs=0;
  var battingAverage = document.getElementById('batAverageBoxid1').value;
  var onBasePerc = document.getElementById('onBasePercBoxid1').value;

  if(!checkBatterStats(battingAverage,onBasePerc)) return false;
  for(var i=0; i<document.getElementById('numSimBoxid').value; i++) {
    if(simAtBat(onBasePerc))
      hits++;
    else
      outs++;
  };

  document.getElementById('numHitsBoxid').value = hits;
  document.getElementById('numOutsBoxid').value = outs;
  document.getElementById('numRunsBoxid').value = "X X X";
}

function simulateMultGame(){
  var runs1 = [];
  var runs2 = [];
  var games =  document.getElementById('gameNum').value;
  if(!isNumber(games))
    games = 1;
  for(var gamenum=0;gamenum<games;gamenum++){
    var temp = simulateGame(1);
    runs1.push(temp[0]);
    runs2.push(temp[1]);
  }
  var allRuns = runs1.concat(runs2);
  var allRunAv = average(allRuns);
  var r1Av = average(runs1);
  var r2Av = average(runs2);
  document.getElementById('team1Score').value = r1Av.toFixed(2);
  document.getElementById('team2Score').value = r2Av.toFixed(2);
  document.getElementById('numHitsBoxid').value = "X X X";
  document.getElementById('numRunsBoxid').value = allRunAv.toFixed(2);
  document.getElementById('numOutsBoxid').value = "X X X";

  clearHists();
  makeHisto(runs1,"Team 1 Score","imageOut");
  makeHisto(runs2,"Team 2 Score","imageOut2");
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

function simulateGame(mode) {
  var runs = [0,0];
  var runLog = [];
  var inning = 1;
  var currentBatterNumber = [0,0];
  while(inning <= 9 || (runs[0] == runs[1])) {
    for(var team=1; team<=2; team++) {
      var temp = runSimInning(1,team,currentBatterNumber[team-1]);
      if(temp == "exit") {
        alert("runSimInning Failed. Exit.");
        return;
      }

      runs[team-1] += temp[1];
      currentBatterNumber[team-1] = temp[2];
    }
    inning++;
  }
  document.getElementById('team1Score').value = runs[0];
  document.getElementById('team2Score').value = runs[1];
  if(runs[0] > runs[1])
    updateRecord(teamOne());
  if(runs[1] > runs[0])
    updateRecord(teamTwo());
  if(mode == 1) {
    return runs;
  }
}

function runMultInnings(team) {
  var numInns = document.getElementById('numInnBoxid').value
  var runs = 0;
  var hits = 0;
  var hitLog = [];
  var runLog = [];
  var simCount = 0;
  for(var i=0; i<numInns; i++) {
    var temp = runSimInning(1,team,0);
    if(temp == "exit")
      return;
    hits += temp[0];
    runs += temp[1];
    hitLog.push(temp[0]);
    runLog.push(temp[1]);
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

function runSimInning(mode,team,currentBatter)
{
  team = checkValidTeam(team);

  var hits=0;
  var outs=0;
  var runs=0;
  var hitType=0;
  var hitterNum = currentBatter;
  var baseState=[0,0,0];
  var batterStats = [];
  batterStats = getLineup(team);
  if(batterStats == false)
    return;

  while(outs < 3) {
    var battingAverage = batterStats[hitterNum][0];
    var onBasePerc = batterStats[hitterNum][1];
    if(simAtBat(onBasePerc)) {
      hits++;
      hitType = determineHitType((onBasePerc-battingAverage)/onBasePerc);
      runs += moveRunners(hitType, baseState);
    } else {
      outs++;
    }
    if(++hitterNum >= batterStats.length)
      hitterNum = 0;
  }
  if(mode == 1) {
    var innStats = [hits, runs, hitterNum];
    return innStats;
  } else {
    document.getElementById('numHitsBoxid').value = hits;
    document.getElementById('numOutsBoxid').value = outs;
    document.getElementById('numRunsBoxid').value = runs;
  }
}

function checkValidTeam(team) {
  if(team != 1 && team != 2) {
    alert("Bad Team Selection. Internal Problem. Default to 1.");
    team = 1;
  }
  return team;
}

function lineupFailure() {
  document.getElementById('numHitsBoxid').value = "Invalid Lineup";
  document.getElementById('numOutsBoxid').value = "Invalid Lineup";
  document.getElementById('numRunsBoxid').value = "Invalid Lineup";
}

function getLineup(team) {
  if(team == 1) {
    var startNum = 1;
    var endNum = 9;
  } else if(team == 2) {
    var startNum = 10;
    var endNum = 18;
  } else {
    lineupFailure();
    return false;
  }

  var batterStats = [];
  for (var i = startNum; i <= endNum; i++) {
    var avg = document.getElementById('batAverageBoxid'+i).value;
    var obp = document.getElementById('onBasePercBoxid'+i).value;
    if(!checkBatterStats(avg,obp)) {
      lineupFailure();
      return false;
    }
    batterStats.push([avg,obp]);
  }
  return batterStats;
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

function determineHitType(percentWalks) {
  if(checkIfWalk(percentWalks)) return 1;

  var roll = Math.random();
  roll *= 10.;
  if(roll > 9.5)
    return 4;
  if(roll > 9)
    return 3;
  if(roll > 6)
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
