# Baseball Simulator
This is an attempt to teach myself Javascript. This README will quickly
discuss the different functions.

#### Simulate At Bat
Reads in the OBP and decides if the at bat results in a hit/walk or an out.
This is simulated the number of times listed in 'Num At Bat Sims."

#### Simulate Inning
Simulates a single inning, reporting the number of hits and runs scored. Every
batter is currently assumed to have the same OBP and average. Base runners
advance one base on a single, two bases on a double, etc. Consider it as
"ghost runner" rules from your childhood. 

#### Simulate Multiple Innings
Repeats the "Simulate Inning," except that it does in N times and reports the
average number of runs and hits/walks per inning across the simulation.
