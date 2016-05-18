function onOpen()
{
  setDefaultValues();
}

function setToAverage(team)
{
    if(team == 1){
      var startNum = 1;
      var endNum = 9;
    }
    else if(team == 2){
      var startNum = 10;
      var endNum = 18;
    } 

  var batterStats = [];
  for (var i = startNum; i <= endNum; i++) {
    document.getElementById("batAverageBoxid"+i).value = 0.25;
    document.getElementById("onBasePercBoxid"+i).value = 0.3;
  }
} 

function setDefaultValues()
{
  for(var team = 1; team<=2; team++){
    if(team == 1){
      var startNum = 1;
      var endNum = 9;
    }
    else if(team == 2){
      var startNum = 10;
      var endNum = 18;
    }

    for (var i = startNum; i <= endNum; i++) {
      document.getElementById('batAverageBoxid'+i).value = 0.25;
      document.getElementById('onBasePercBoxid'+i).value = 0.3;
    }
  }

  document.getElementById('numSimBoxid').value = 10;
  document.getElementById('numInnBoxid').value = 1000;
}

function runSimAtBat()
{
  var hits=0;
  var outs=0;
  var battingAverage = document.getElementById('batAverageBoxid1').value;
  var onBasePerc = document.getElementById('onBasePercBoxid1').value;

  if(!checkBatterStats(battingAverage,onBasePerc)) return false;
  for(var i=0; i<document.getElementById('numSimBoxid').value; i++)
    {
      if(simAtBat(onBasePerc))
        hits++;
      else
        outs++;
    };

    document.getElementById('numHitsBoxid').value = hits;
    document.getElementById('numOutsBoxid').value = outs;
    document.getElementById('numRunsBoxid').value = "X X X";
}

function runMultInnings(team)
{
  if(team != 1 && team != 2){
    alert("Bad Team Selection. Internal Problem. Default to 1.");
    team = 1;
  }

  var numInns = document.getElementById('numInnBoxid').value 
  var runs = 0;
  var hits = 0;
  var hitLog = [];
  var runLog = [];
  var simCount = 0;
  for(var i=0; i<numInns; i++)
    {
      var temp = runSimInning(1,team);
      if(temp == "exit")
        return;
      hits += temp[0];
      runs += temp[1];
      hitLog.push(temp[0]);
      runLog.push(temp[1]);
      simCount++;
    }
    if(simCount > 0)
      {
        document.getElementById('numHitsBoxid').value = hits/simCount;
        document.getElementById('numRunsBoxid').value = runs/simCount;
        document.getElementById('numOutsBoxid').value = "X X X";
      }
      else
        {
          document.getElementById('numHitsBoxid').value = "X X X";
          document.getElementById('numRunsBoxid').value = "X X X";
        }
        makeHisto(hitLog);
        makeHisto(runLog);
}

function makeHisto(data)
{
  d3.select("body")
    .datum(data)
    .call(histogramChart()
    .bins(Math.max.apply(Math, data))
    .tickFormat(d3.format("0f")));

}

function runSimInning(mode,team)
{
  var hits=0;
  var outs=0;
  var runs=0;
  var hitType=0;
  var hitterNum = 0;
  var baseState=[0,0,0]; 
  var batterStats = [];
  batterStats = getLineup(team);
  if(batterStats == false)
    return;

  while(outs < 3)
    { 
      var battingAverage = batterStats[hitterNum][0];
      var onBasePerc = batterStats[hitterNum][1];
      if(simAtBat(onBasePerc))
        {
          hits++;
          hitType = determineHitType((onBasePerc-battingAverage)/onBasePerc);
          runs += moveRunners(hitType, baseState);
        }
        else
          outs++;
        if(++hitterNum >= batterStats.length)
          hitterNum = 0;
    }
    if(mode == 1)
      {
        var innStats = [hits, runs];
        return innStats;
      }
      else 
        {
          document.getElementById('numHitsBoxid').value = hits;
          document.getElementById('numOutsBoxid').value = outs;
          document.getElementById('numRunsBoxid').value = runs;
        }

}

function lineupFailure()
{
  document.getElementById('numHitsBoxid').value = "Invalid Lineup";
  document.getElementById('numOutsBoxid').value = "Invalid Lineup";
  document.getElementById('numRunsBoxid').value = "Invalid Lineup";

}

function getLineup(team)
{
  if(team == 1){
    var startNum = 1;
    var endNum = 9;
  }
  else if(team == 2){
    var startNum = 10;
    var endNum = 18;
  }
  else{
    lineupFailure();
    return false;
  }

  var batterStats = [];
  for (var i = startNum; i <= endNum; i++) {
    var avg = document.getElementById('batAverageBoxid'+i).value;
    var obp = document.getElementById('onBasePercBoxid'+i).value;
    if(!checkBatterStats(avg,obp)){
      lineupFailure();
      return false;
    }
    batterStats.push([avg,obp]);
  }
  return batterStats;
}

function checkBatterStats(battingAverage,OBP)
{
  if(0 > battingAverage || battingAverage >= 1 || 0 > OBP || OBP >= 1)
    {
      alert("Batting Average & On Base Percentage between (0,1) please.");
      return false;
    }
    else if (battingAverage > OBP){
      alert("OBP > BA for one batter");
      return false;
    }
    else 
      return true;
}

function simAtBat(OBP)
{
  if(Math.random() < OBP)
    return true;
  else
    return false;
}

function determineHitType(percentWalks)
{
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

function checkIfWalk(percentWalks)
{
  if(Math.random() < percentWalks)
    {
      return true;
    }
    else 
      return false;
}

function moveRunners(hit,baseState)
{
  var runs=0;
  for(var i=0; i<hit; i++)
    {
      for(var base=3; base>0; base--)
        {
          if(base == 3 && baseState[base] == 1)
            {
              runs++;
              baseState[base] = baseState[base-1];
            }
            if(base == 1 && i == 0)
              baseState[base] = 1;
            else if(base == 1)
              baseState[base] = 0;
            else
              baseState[base] = baseState[base-1];
            //alert(base+" "+baseState[base])
        }
    }
    return runs;
}
