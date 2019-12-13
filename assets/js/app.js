/* Build and append the "environment data" cell.
 *
 * Constructs and returns a table cell for each coin and each environment that
 * specifies whether or not the coin + environment are at chainhead (compared)
 * to a public block explorer or behind and by how much.
 */
function appendEnvironmentCell(envData, tr) {
  console.log('append td: ' + envData.bgURL);

  // Create the table cell to be appended to the passed tr well as the container
  // div (which all other divs will be nested) and other divs required for
  // rendering.
  var td = $('<td style="border:1px solid #dee2e6;padding:0px;">');
  var containerDiv = $('<div>');
  var blockDifferenceDiv = $('<div style="width:100%; font-size:40px; font-weight:bold; text-align:center; padding-top:2px; line-height:55px;">');
  var latestBlockDiv = $('<div style="width:100%; text-align:center; font-size:18px; color:#555; padding-bottom:5px;">');

  // Calculate difference between our indexers and public block explorers
  var referenceBlock = envData.referenceBlock || 'N/A'; // This is the most recently indexed public block
  var latestBlock = envData.latestBlock || 'N/A'; // This is BitGo's most recently indexed block
  var difference = latestBlock - referenceBlock;

  // Use the calculated difference to style elements
  var backgroundColor = '#fff';
  var textColor = '#555';
  // If difference is a string, background is white
  if (isNaN(difference)) {
    difference = '-';
  }
  // If difference is positive or neglible, background is green
  else if (difference > -8) {
    backgroundColor = '#e2ffe2';
    textColor = 'green';
  }
  // If difference is more than 10 blocks, background is red
  else if (difference <= -8) {
    backgroundColor = 'mistyrose';
    textColor = 'red';
  }
  td.css('background',  backgroundColor);

  // Style the blocksBehindDiv
  blockDifferenceDiv.css('color', textColor);
  blockDifferenceDiv.html(difference);

  // Populate the latestBlockDiv
  latestBlockDiv.html('<a href="'+envData.bgURL+'">' +latestBlock + '</a> <span style="font-weight:bold; color:#000">/</span> <a href="'+envData.publicURL+'">'+ referenceBlock + '</a>');

  // Append the divs to the container div and the container to the td
  containerDiv.append(blockDifferenceDiv);
  containerDiv.append(latestBlockDiv);
  td.append(containerDiv);
  tr.append(td);
}

/* Build and append the "coin" cell.
 *
 * Constructs and returns a table cell with the coin logo + meta data for
 * each coin defined in the json file.
 */
function appendCoinCell(key, coinData, tr) {
  var image = $('<img src="'+coinData.icon+'" width="60em" height="60em" />');
  var td = $('<td style="width: 125px; vertical-align: middle; background: white !important; text-align: center;">');
  td.append(image);
  td.append($('<b style="font-size: 17px; display: block; margin-top:3px;color:#666;">'+key+'</b>'));
  tr.append(td);
}

/* Build and append table rows to the master table using coin data passed
 * in from the calling fcn.
 */
function appendTableRow(key, coinData) {
  console.log('append tr');
  // Build the tr and append tds to it
  var tr = $('<tr>');
  appendCoinCell(key, coinData, tr);

  // Iterate over each environment in the data dict and create table
  // cells to be appended to the table row
  $.each(coinData.environments, function(index, environmentData) {
    appendEnvironmentCell(environmentData, tr);
  });

  // Append the tr to the table
  $('#js-statusTable').append(tr);
}

/* Parse indexer state data from s3.
 *
 * This function is invoked after json data regarding indexer status is
 * fetched from s3. It uses this data to construct readable table.
 */
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

/* On domready, fetch and parse the json file that contains the
 * status of our indexers and use it to render a table of results
 * for the user.
 */
url = "https://s3-us-west-2.amazonaws.com/bitgo-indexer-health/latest.json";
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
