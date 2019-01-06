// Parse indexer state data from s3
function handleIndexerStateDataFromS3(data){

  // Update the date last updated span
  $("#js-lastUpdated").html(data.metadata.dateFetched);

  // Iterate over each coin in the data structure and build the table
  $.each( data.indexers, function( key, coinData ) {
    var coinName = coinData.name;
    var iconPath = coinData.icon;

    // Iterate over each environment in the data dict and create table
    // rows to be appended to the table
    $.each( coinData.environments, function( index, environmentData ) {
      // Build the tr and append tds to it
      var tr = $('<tr>');

      // Determine whether we need to alert the user
      var statusTableCell = $('<td><i class="mdi mdi-checkbox-marked-circle"></i></td>');
      if( !environmentData.status ){
        statusTableCell = $('<td><i class="mdi mdi-alert-circle"></i></td>');
        tr.css('background', 'mistyrose');
      }

      tr.append($('<td>'+coinData.name+'</td>'));
      tr.append($('<td>'+environmentData.network+'</td>'));
      tr.append(statusTableCell);
      tr.append($('<td class="ta-r">'+environmentData.latestBlock+'</td>'));
      tr.append($('<td class="ta-r">'+environmentData.blocksBehind+'</td>'));
      tr.append($('<td class="ta-r"><a href="'+environmentData.bgURL+'"><i class="mdi mdi-link"></i></a></td>'));
      tr.append($('<td class="ta-r"><a href="'+environmentData.publicURL+'"><i class="mdi mdi-link"></i></a></td>'));

      // Append the tr to the table
      $('#js-statusTable').append(tr);
    });
  });
}

// On domready, fetch and parse the json file that contains the
// status of our indexers and use it to render a useful table for
// the user.
url = "https://s3-us-west-2.amazonaws.com/bitgo-indexer-health/latest.json";
$(function() {
  $.getJSON({
    url: url,
    success: handleIndexerStateDataFromS3,
  });
});
