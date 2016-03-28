/*
   Copyright 2014 The Charles Stark Draper Laboratory

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * Created by dreed on 3/24/15.
 */

$( document ).ready(function() {
    var map = L.map('map-container').setView([51.505, -0.09], 13);

    L.tileLayer('http://{s}.tiles.mapbox.com/v3/dvreed77.i39bj2hd/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);

    window.map = map;

    var markers = [];
    $('#map-button0').click(function() {
        map.setView(L.latLng(48.8567, 2.3508), 10)
    });

    $('#map-button1').click(function() {
        map.setView(L.latLng(41.8369, -87.6847), 11)
    });

    $('#map-button2').click(function() {
        var bounds = map.getBounds();

        var west = bounds.getWest(),
            north = bounds.getNorth(),
            east = bounds.getEast(),
            south = bounds.getSouth();

        var lat = south + (north-south)*Math.random(),
            lng = west + (east-west)*Math.random();

        var marker = L.marker([lat, lng]).addTo(map);


        markers.push(marker);
        myLog({
            activity: 'add',
            elementType: 'map',
            elementGroup: 'map_group',
            elementSub: 'marker',
            source: 'system',
            tags: []
        })
    });

    $('#map-button3').click(function() {
        var marker = markers.pop()

        map.removeLayer(marker);

        myLog({
            activity: 'remove',
            elementType: 'map',
            elementGroup: 'map_group',
            elementSub: 'marker',
            source: 'system',
            tags: []
        })
    });

    $(function() {
        $( "#slider0" ).slider();


    });

    $(function() {
        $( "#slider1" ).slider({
            range: true,
            min: 0,
            max: 500,
            values: [ 75, 300 ],
            slide: function( event, ui ) {
                $( "#value" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            }
        });

        $( "#value" ).val( $( "#slider1" ).slider( "values", 0 ) +
        " - " + $( "#slider1" ).slider( "values", 1 ) );
    });
});

