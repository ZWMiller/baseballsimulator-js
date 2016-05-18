# Baseball Simulator
This is an attempt to teach myself Javascript. This README will quickly
discuss the different functions.

#### Simulate At Bat
Reads in the OBP of (Team 1, Player 1) and decides if the at bat results in a hit/walk or an out.
This is simulated the number of times listed in 'Num At Bat Sims."

#### Simulate Inning
Simulates a single inning using team 1 as input, reporting the number of hits and runs scored. Base runners
advance one base on a single, two bases on a double, etc. Consider it as
"ghost runner" rules from your childhood. 

#### Simulate Multiple Innings
Repeats the "Simulate Inning," except that it does in N times and reports the
average number of runs and hits/walks per inning across the simulation. This
can be done for either Team 1 or Team 2, depending on which team's button is
selected. Will also plot a histogram of the simulation results.

#### Simulate Game
Pits the two teams against each other for 9 innings (+ extra innings to
resolve ties). The team with the highest score at the end of 9 innings is the
winner and the record of the two teams is updated after each game.

Last Updated - 5/17/16, ZWM
