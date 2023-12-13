mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10',
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h6>${campground.title}</h6><p>${campground.location}</p>`
            )
    )
    .addTo(map);
 
