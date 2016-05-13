function onOpen()
{
  setDefaultValues();
}

function setDefaultValues()
{
  document.getElementById('batAverageBoxid').value = 0.25;
  document.getElementById('onBasePercBoxid').value = 0.3;
  document.getElementById('numSimBoxid').value = 10;
  document.getElementById('numInnBoxid').value = 10
}

function runSimAtBat()
{
  var hits=0;
  var outs=0;
  var battingAverage = document.getElementById('batAverageBoxid').value;
  var onBasePerc = document.getElementById('onBasePercBoxid').value;

  if(!checkBattingAverage(battingAverage,onBasePerc)) return false;
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

function runMultInnings()
{
  var numInns = document.getElementById('numInnBoxid').value 
  var runs = 0;
  var hits = 0;
  var simCount = 0;
  for(var i=0; i<numInns; i++)
    {
      var temp = runSimInning(1);
      hits += temp[0];
      runs += temp[1];
      simCount++;
    }
    if(simCount > 0)
      {
        document.getElementById('numHitsBoxid').value = hits/simCount;
        document.getElementById('numRunsBoxid').value = runs/simCount;
      }
      else
        {
          document.getElementById('numHitsBoxid').value = "X X X";
          document.getElementById('numRunsBoxid').value = "X X X";
        }
}

function runSimInning(mode)
{
  var hits=0;
  var outs=0;
  var runs=0;
  var hitType=0;
  var baseState=[0,0,0];  
  var battingAverage = document.getElementById('batAverageBoxid').value;
  var onBasePerc = document.getElementById('onBasePercBoxid').value;

  if(!checkBattingAverage(battingAverage,onBasePerc)) return false;
  while(outs < 3)
    {      
      if(simAtBat(onBasePerc))
        {
          hits++;
          hitType = determineHitType((onBasePerc-battingAverage)/onBasePerc);
          runs += moveRunners(hitType, baseState);
        }
        else
          outs++;
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

function checkBattingAverage(battingAverage,OBP)
{
  if(0 > battingAverage || battingAverage >= 1 || 0 > OBP || OBP >= 1)
    {
      alert("Batting Average & On Base Percentage between (0,1) please.");
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
