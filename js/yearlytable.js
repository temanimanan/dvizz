var completeData, currentYear = "2004", currentRound = '0', selectedPlayer = 'clear';
var menu1 = [
  {id: '2004', name: '2004'},
  {id: '2005', name: '2005'},
  {id: '2006', name: '2006'},
  {id: '2007', name: '2007'},
  {id: '2008', name: '2008'},
  {id: '2009', name: '2009'},
  {id: '2010', name: '2010'},
  {id: '2011', name: '2011'},
  {id: '2012', name: '2012'},
  {id: '2013', name: '2013'},
  {id: '2014', name: '2014'}
];
var menu2 = [
  {id: '0', name: 'Show All'},
  {id: '1', name: 'Round 1'},
  {id: '2', name: 'Round 2'},
  {id: '3', name: 'Round 3'},
  {id: '4', name: 'Round 4'},
  {id: '5', name: 'Quater Finals'},
  {id: '6', name: 'Semi Finals'}
];
var menu3 = [
  {id: 'clear', name: 'Clear Selected Player'}
];

function result(m) {
  var res = m['results'];
  return res;
}

function nameId(n) {
  return n.replace(/[\., ]/g, '');
}

function playerClick(d) {
  var e = d3.select(this);

  d3.select('#menu3').selectAll('div').classed('selected', false);

  if(e.classed('selected')) {
    d3.selectAll('div.player')
      .classed('selected', false);
    return;
  }

  d3.selectAll('div.player')
    .classed('selected', false);

  var id = e.classed('winner') ? d.winner : d.loser;
  selectedPlayer = id;
  updateChart();
  d3.selectAll('div.player.'+ nameId(id))
    .classed('selected', true);  
}

function menu1Click(d) {
  if(currentYear === d.id)
    return;

  d3.select('#menu1').selectAll('div').classed('selected', false);
  d3.select('#menu3').selectAll('div').classed('selected', true);
  d3.select(this).classed('selected', true);

  selectedPlayer = 'clear';
  currentYear = d.id;
  updateChart();
}

function menu2Click(d) {
  if(currentRound === d.id)
    return;

  d3.select('#menu2').selectAll('div').classed('selected', false);
  d3.select('#menu3').selectAll('div').classed('selected', true);
  d3.select(this).classed('selected', true);

  selectedPlayer = 'clear';
  currentRound = d.id;
  updateChart();
}

function menu3Click(d) {
  if(selectedPlayer === d.id)
    return;

  d3.select('#menu3').selectAll('div').classed('selected', false);
  d3.select(this).classed('selected', true);

  selectedPlayer = d.id;
  updateChart();
}

function updateChart() {

  d3.select('#chart')
    .selectAll('div')
    .remove();

  createTable();
}

function yearlyData(data, year, curRound) {  
  var yearlyData = [];

  data.forEach(function(d) {
    switch(d.round) {
      case "First":
          round = 1;
          break;
      case "Second":
          round = 2;
          break;
      case "Third":
          round = 3;
          break;
      case "Fourth":
          round = 4;
          break;
      case "quarter":
          round = 5;
          break;
      case "semi":
          round = 6;
          break;
      case "Final":
          round = 7;
          break;
    };
    if(d.year == year && round > curRound && selectedPlayer == 'clear') {      
      yearlyData.push({winner: d.player1, loser: d.player2, results: d.results, round: round});
    };
    if(d.year == year && round > curRound) {
      if(d.player1 == selectedPlayer || d.player2 == selectedPlayer) {
        yearlyData.push({winner: d.player1, loser: d.player2, results: d.results, round: round});
      };
    };
  });

  //console.log(yearlyData);
  var matches = _.groupBy(yearlyData, function(v) {return v.round;});
  matches = _.map(matches, function(v) {return v;});
  return matches;
}

function createTable() {
  var round = 1;
  var width = 160;
  var table = d3.select('#chart');

  table
    .selectAll('div')
    .data(yearlyData(completeData, currentYear, currentRound))
    .enter()
    .append('div')
    .classed('round', true)
    .style('left', function(d, i) {return i * width + 'px';});

  var rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Quarter finals', 'Semi finals', 'Final'];
  table
    .selectAll('div.round')
    .append('div')
    .classed('round-label', true)
    .text(function(d) {return rounds[d[0].round-1];});

  table
    .selectAll('div.round')
    .selectAll('div.match')
    .data(function(d) {return d;})
    .enter()
    .append('div')
    .classed('match', true);

  table
    .selectAll('div.match')
    .append('div')
    .attr('class', function(d) {return 'winner player ' + nameId(d.winner);})
    .text(function(d) {return d.winner;})
    .on('click', playerClick);

  table
    .selectAll('div.match')
    .append('div')
    .text('bt.');

  table
    .selectAll('div.match')
    .append('div')
    .attr('class', function(d) {return 'loser player ' + nameId(d.loser);})
    .text(function(d) {return d.loser;})
    .on('click', playerClick);

  table
    .selectAll('div.match')
    .append('div')
    .classed('score', true)
    .text(function(d) {return result(d);});

  d3.select('#menu1')
    .selectAll('div')
    .data(menu1)
    .enter()
    .append('div')
    .text(function(d) {return d.name;})
    .classed('selected', function(d, i) {return i==0;})
    .on('click', menu1Click);

  d3.select('#menu2')
    .selectAll('div')
    .data(menu2)
    .enter()
    .append('div')
    .text(function(d) {return d.name;})
    .classed('selected', function(d, i) {return i==0;})
    .on('click', menu2Click);

  d3.select('#menu3')
    .selectAll('div')
    .data(menu3)
    .enter()
    .append('div')
    .text(function(d) {return d.name;})
    .classed('selected', function(d, i) {return i==0;})
    .on('click', menu3Click);
}

d3.csv('data/10yearAUSOpenMatches.csv', function(err, data) {
  completeData = data;
  createTable();  
});

