function setEnvironmentStyle(difference, envData, td) {
  if (!envData.status && envData.network === 'MainNet') {
    // this is really bad, sound very many alarms
    td.css('background',  '#961d0f');
    return;
  }

  if (isNaN(difference)) {
    return;
  }

  var color = '#e2ffe2';
  if (difference < -2 && difference > -10) {
    color = 'khaki';
  } else if (difference <= -10) {
    color = 'mistyrose';
  }
  td.css('background',  color);
}

function setHeightDifferenceStyle(difference, span) {
  if (isNaN(difference)) {
    return;
  }

  var color = 'green';
  if (difference < -2 && difference > -10) {
    color = 'orange';
  } else if (difference <= -10) {
    color = 'red';
  }
  span.css('color', color);
}

function appendEnvironmentCell(envData, tr) {
  console.log('append td: ' + envData.bgURL);
  //var statusGoodIcon = $('<i style="font-size: 64px !important; width: 50; height: 50;" class="mdi mdi-checkbox-marked-circle"></i>');
  //var statusBadIcon = $('<i style="font-size: 64px !important; width: 50; height: 50;" class="mdi mdi-alert-circle"></i>');

  var td = $('<td style="text-align: center;">');


  function makeRow(content) {
    var row = $('<div style="width: 100;">');
    row.append(content);
    td.append(row);
  }

  function makeLabel(content) {
    var labelSpan = $('<span style="font-size: 14px; color: grey;">'+content+'</span>');
    makeRow(labelSpan);
  }

  // For each coin, there are three networks (MainNet + TestNet + Dev); The
  // app should show a table cell for each env, indicating it's status
  //var statusIcon = !!envData.status ? statusGoodIcon : statusBadIcon;
  //makeRow(statusIcon)

  var referenceBlock = envData.referenceBlock || 'N/A';
  var latestBlock = envData.latestBlock || 'N/A';
  var difference = latestBlock - referenceBlock;
  if (isNaN(difference)) {
    difference = 'N/A';
  }
  makeLabel('Difference');
  var blockDifference = $('<span style="font-size: 60px; font-weight: bolder;">'+difference+'</span>');
  setHeightDifferenceStyle(difference, blockDifference);
  makeRow(blockDifference);

  makeLabel('Indexer / Blockchain');
  var latestBlockSpan = $('<span style="font-size: 32px; font-weight: bold;">'+latestBlock+' / '+referenceBlock+'</span>');
  makeRow(latestBlockSpan);

  var urlContainer = $('<div>');
  var bitgoUrl = $('<span style="font-size: 12px; padding-right: 1em;"><a href="'+envData.bgURL+'">BitGo</a></span>');
  var publicUrl = $('<span style="font-size: 12px; padding-left: 1em;"><a href="'+envData.publicURL+'">Explorer</a></span>');
  urlContainer.append(bitgoUrl);
  urlContainer.append(publicUrl);
  makeRow(urlContainer);

  setEnvironmentStyle(difference, envData, td);
  tr.append(td);
}

function appendCoinCell(key, coinData, tr) {
  var style = 'width: 125px; vertical-align: middle; background: white !important; text-align: center;';
  var image = $('<img src="'+coinData.icon+'" width="80em" height="80em" style="margin-top: 1em;" />');
  var td = $('<td style="'+style+'">');
  td.append($('<b style="font-size: 20px; display: block;">'+key+'</b>'))
  td.append(image);
  tr.append(td);
}

function appendTableRow(key, coinData) {
  console.log('append tr');
  // Build the tr and append tds to it
  var tr = $('<tr>');
  appendCoinCell(key, coinData, tr);

  var tableHeadRow = $('table thead tr');
  if (coinData.environments.length === 3 && tableHeadRow.children().length !== 4) {
    console.log('append dev to table header');
    var devHeader = $('<th>Dev</th>');
    tableHeadRow.append(devHeader);
  }
  // Iterate over each environment in the data dict and create table
  // cells to be appended to the table row
  $.each(coinData.environments, function(index, environmentData) { 
    appendEnvironmentCell(environmentData, tr);
  });

  // Append the tr to the table
  $('#js-statusTable').append(tr);
}

// Parse indexer state data from s3
function handleIndexerStateDataFromS3(data){
  console.log('handle');

  // Update the date last updated span
  $("#js-lastUpdated").html(data.metadata.dateFetched);

  // Flush existing data in the table as the logic below appends new data into
  // the table
  $('#js-statusTable tbody').html('');

  // Iterate over each coin in the data structure and build the table
  $.each(data.indexers, appendTableRow);
}

// On domready, fetch and parse the json file that contains the
// status of our indexers and use it to render a useful table for
// the user.
url = "https://s3-us-west-2.amazonaws.com/bitgo-indexer-health-fork/latest.json";
$(function() {
  console.log('load');

  // Wrap the call in a polling function so it re-fetches new json every min
  // Note, the indexer state data (a JSON file on s3) is generated every 5 min
  function poll() {
    console.log('poll');
    // Fetch indexer state from a JSON file on s3
    $.getJSON({
      url: url,
      success: handleIndexerStateDataFromS3
    });
  }

  setInterval(poll, 60000);
  poll();
});

// vim: sw=2 ts=2
