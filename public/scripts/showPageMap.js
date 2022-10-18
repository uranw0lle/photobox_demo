/* 
Code für die HTML Seite

<script src='https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js'></script>
<script>
    const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
</script>
<script src='/scripts/showPageMap.js'></script> 

CSS Gelöt
<link href="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css" rel="stylesheet">

*/

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL from https://docs.mapbox.com/api/maps/styles/
    center: photospot.geometry.coordinates, // starting position [lng, lat]
    zoom: 11, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
    .setLngLat(photospot.geometry.coordinates)
    .addTo(map)