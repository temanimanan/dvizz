var currentYear = "2004", currentRound = "First";
var xData = 7, yData = 8, xLabel = 'Winner Points', yLabel = 'Error';
var completeData, playerData;
var menu1 = [
    { id: '2004', name: '2004' },
    { id: '2005', name: '2005' },
    { id: '2006', name: '2006' },
    { id: '2007', name: '2007' },
    { id: '2008', name: '2008' },
    { id: '2009', name: '2009' },
    { id: '2010', name: '2010' },
    { id: '2011', name: '2011' },
    { id: '2012', name: '2012' },
    { id: '2013', name: '2013' },
    { id: '2014', name: '2014' }
];

var menu2 = [
    { id: 'First', name: 'First' },
    { id: 'Second', name: 'Second' },
    { id: 'Third', name: 'Third' },
    { id: 'Fourth', name: 'Fourth' },
    { id: 'quarter', name: 'Quarter' },
    { id: 'semi', name: 'Semi-Final' },
    { id: 'Final', name: 'Final' }
];

var menu3 = [
    { id: 7, name: 'Winner Points' },
    { id: 8, name: 'Error' },
    { id: 1, name: 'Ace' },
    { id: 2, name: 'Double' },
    { id: 3, name: 'Fast Serve' },
    { id: 4, name: 'Avg First Serve' },
    { id: 5, name: 'Avg Sec Serve' },
    { id: 6, name: 'Total Points' }
];

var menu4 = [
    { id: 8, name: 'Error' },
    { id: 7, name: 'Winner Points' },
    { id: 1, name: 'Ace' },
    { id: 2, name: 'Double' },
    { id: 3, name: 'Fast Serve' },
    { id: 4, name: 'Avg First Serve' },
    { id: 5, name: 'Avg Sec Serve' },
    { id: 6, name: 'Total Points' }
];

function menu1Click(d) {
    if (currentYear === d.id)
        return;

    d3.select('#menu1').selectAll('div').classed('selected', false);
    d3.select(this).classed('selected', true);

    currentYear = d.id;
    generateData();
    generateChart();
}

function menu2Click(d) {
    if (currentRound === d.id)
        return;

    d3.select('#menu2').selectAll('div').classed('selected', false);
    d3.select(this).classed('selected', true);

    currentRound = d.id;
    generateData();
    generateChart();
}

function menu3Click(d) {
    if (xData === d.id)
        return;

    d3.select('#menu3').selectAll('div').classed('selected', false);
    d3.select(this).classed('selected', true);

    xData = d.id;
    xLabel = d.name;
    generateChart();
}

function menu4Click(d) {
    if (yData === d.id)
        return;

    d3.select('#menu4').selectAll('div').classed('selected', false);
    d3.select(this).classed('selected', true);

    yData = d.id;
    yLabel = d.name;
    generateChart();
}

function generateChart() {
    var dataValues = [];

    playerData.forEach(function (d) {
        dataValues.push({ name: d[0], data: [[parseInt(d[xData]), parseInt(d[yData])]] });
    });

    Highcharts.chart('chart', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: {
            title: {
                text: xLabel
            }
        },
        yAxis: {
            title: {
                text: yLabel
            }
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 10000,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: xLabel + ': {point.x}<br>' + yLabel + ': {point.y}'
                }
            }
        },
        series: dataValues
    });

    d3.select('#menu1')
        .selectAll('div')
        .data(menu1)
        .enter()
        .append('div')
        .text(function (d) { return d.name; })
        .classed('selected', function (d, i) { return i == 0; })
        .on('click', menu1Click);

    d3.select('#menu2')
        .selectAll('div')
        .data(menu2)
        .enter()
        .append('div')
        .text(function (d) { return d.name; })
        .classed('selected', function (d, i) { return i == 0; })
        .on('click', menu2Click);

    d3.select('#menu3')
        .selectAll('div')
        .data(menu3)
        .enter()
        .append('div')
        .text(function (d) { return d.name; })
        .classed('selected', function (d, i) { return i == 0; })
        .on('click', menu3Click);

    d3.select('#menu4')
        .selectAll('div')
        .data(menu4)
        .enter()
        .append('div')
        .text(function (d) { return d.name; })
        .classed('selected', function (d, i) { return i == 0; })
        .on('click', menu4Click);
}

function generateData() {
    playerData = [];

    completeData.forEach(function (d) {
        if (d.year == currentYear && d.round == currentRound) {
            playerData.push([d.player1, d.ace1, d.double1, d.fastServe1, d.avgFirstServe1, d.avgSecServe1, d.total1, d.winner1, d.error1]);
            playerData.push([d.player2, d.ace2, d.double2, d.fastServe2, d.avgFirstServe2, d.avgSecServe2, d.total2, d.winner2, d.error2]);
        }
    });

    console.log(playerData);
};

d3.csv('data/10yearAUSOpenMatches.csv', function (err, data) {
    completeData = data;

    generateData();
    generateChart();
});