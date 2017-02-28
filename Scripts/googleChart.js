/**
 * Created by Michael Hansen on 2/28/2017.
 */

//Load in the data for the google line chart then call drawChart()
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

//Leaving these variables outside the function will allow us to access them later for toggling
var Mdata, Moptions, Mchart, view;
var rgdpToggle = true, unrateToggle = true;

//This is the main build function for the google chart
function drawChart() {
  //here we create the data to be used and the view to be presented to the user
  Mdata = google.visualization.arrayToDataTable(chartMaterial);
  view = new google.visualization.DataView(Mdata);

  //Settings such as borders, fonts, and colors for the graph, labels, and axes go here.
  Moptions = {
    title: 'Real Gross Domestic Product "RGDP" and Unemployment rate over the last 10 years',
    legend: { position: 'bottom' },
    vAxis: { format: '#,###%' },
    backgroundColor: '#E4E4E4'
  };

  //This creates our chart and points it to the div with the id: 'Mixed_Chart'
  Mchart = new google.visualization.LineChart(document.getElementById('Mixed_Chart'));
  Mchart.draw(Mdata, Moptions);
}

//this function toggle the graph by looking at a series of flags, this system has three toggles:
// Show All (Starting Default), Show RGDP, and Show Unemployment Rate (cycling in that order)
function toggleGraph() {
  if (unrateToggle) {
    view.setColumns([0, 1]);
    unrateToggle = false;
  } else if (rgdpToggle) {
    view.setColumns([0, 2]);
    rgdpToggle = false;
  } else {
    view.setColumns([0, 1, 2]);
    rgdpToggle = true;
    unrateToggle = true;
  }
  //Once we have selected the columns to be set, we place the new view into the draw function with our previous options
  Mchart.draw(view, Moptions);
}