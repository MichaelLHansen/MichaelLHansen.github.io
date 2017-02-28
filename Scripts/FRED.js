/**
 * Created by Michael Hansen on 2/28/2017.
 */

var UNRATE = []; //array for unemployment rate (formatted for google line charts)
var RGDP = [];   //array for Real Gross Domestic Product (formatted for google line charts)
var chartMaterial = []; //array for the merged UNRATE and RGDP for the Mixed Chart

//first we build a header block in our array
UNRATE[0] = ["Date", "Unemployment Rate"];

//next we pull in our JSON using a YQL encoded GET. See the Online YQL Console for encoding.
$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%20%22https%3A%2F%2Fapi.stlouisfed.org%2Ffred%2Fseries%2Fobservations%3Fseries_id%3DUNRATE%26observation_start%3D2007-01-01%26observation_end%3D2017-01-01%26api_key%3D2789c4d318db644e3b5523eb731bd171%22&format=json&diagnostics=true&callback=?", function (data) {

  //The JSON object has a very long name so I'm gonna cast it down to something smaller.
  var currentObject = data.query.results.body.observations.observation;

  //Time to iterate over the object grabbing the pertinent data.
  var i = 1;
  while (currentObject) {
    //Date format is YYYY-MM-DD so splicing is simpler than using a regex here.
    year = currentObject.date.toString().slice(0, 4);
    month = currentObject.date.toString().slice(5, 7);
    day = currentObject.date.toString().slice(8, 10);

    //Converting our strings to ints and floats as appropriate.
    UNRATE[i] = [new Date(parseInt(year), parseInt(month), parseInt(day)), parseFloat(currentObject.value)]
    i++;

    //Our object is a series of nested objects, so we move deeper here by appending another ".observation"
    currentObject = currentObject.observation;
  }

  //This block is EXACTLY the same as the UNRATE block, except for the last command to merge.
  RGDP[0] = ["Date", "Real Gross Domestic Product"];
  $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%20%22https%3A%2F%2Fapi.stlouisfed.org%2Ffred%2Fseries%2Fobservations%3Fseries_id%3DA191RL1Q225SBEA%26observation_start%3D2007-01-01%26observation_end%3D2017-01-01%26api_key%3D2789c4d318db644e3b5523eb731bd171%22&format=json&diagnostics=true&callback=?", function (data) {
    var currentObject = data.query.results.body.observations.observation;
    var i = 1;
    while (currentObject) {
      year = currentObject.date.toString().slice(0, 4);
      month = currentObject.date.toString().slice(5, 7);
      day = currentObject.date.toString().slice(8, 10);
      RGDP[i] = [new Date(parseFloat(year), parseFloat(month), parseFloat(day)), parseFloat(currentObject.value)]
      i++;
      currentObject = currentObject.observation;
    }
    //Now that we have our RGDP and UNRATE arrays we can either make
    //single graphs or merge them for a composite graph. We're going to merge them
    merge(UNRATE, RGDP);
  });
});

//
//Second Section for merging RGDP and UNRATE
//

function merge(urate, gdp) {
  k = 1; // incrementor for RGDP array, because the dates won't match due to RGDP being updated quarterly
  curgdp = 0; //This is the current GDP value to be placed into our merged array
  chartMaterial[0] = ["Date", "Unemployment Rate", "RGDP"]; //Building a header row.

  //Now we're gpoing to iterate over both arrays and merge where appropriate.
  for (j = 1; j < urate.length; j++) {
    //If the date matches for the RGDP and the UNRATE we update the value and increment the RGDP counter
    if (k < gdp.length-1 && gdp[k][0].getTime() === urate[j][0].getTime()) {
      //making sure we didn't incrment too far and updating the GDP value
      if (gdp[k][1]) {
        curgdp = gdp[k][1];
      }
      k++;
    }
    //Merge the values into a single array, this duplicates the quarterly RGDP values across each month
    chartMaterial[j] = [
      urate[j][0],
      urate[j][1]*.01,
      curgdp*.01
    ]
  }
}
