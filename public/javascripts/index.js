// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);
console.log("CALLED");
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Team');
  data.addColumn('number', 'Points');
  data.addRows([
    ['Blue', 3],
    ['Red', 1],
    ['Green', 1],
  ]);

  // Set chart options
  var options = {'width':800,
                 'height':500,
                 'is3D':true,
                 'backgroundColor':'#0000A0',
                 'pieSliceText':'label',
                 'legend':'none',
                 'titlePosition':'none',
                 slices: [{color: '#0099CC'}, {color: '#CC0000'}, {color: '#33CC33'}]
                };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}