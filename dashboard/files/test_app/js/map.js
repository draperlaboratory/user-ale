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

    $('#map-button0').click(function() {
        map.setView(L.latLng(48.8567, 2.3508), 10)
    });

    $('#map-button1').click(function() {
        map.setView(L.latLng(41.8369, -87.6847), 11)
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

