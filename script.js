var map = L.map('map', {
    crs: L.CRS.Simple,
}).setView([0, 0], 1);

var mapWidth = 1080;
var mapHeight = 570;

L.imageOverlay('https://www.aeroaccess.de/wp-content/uploads/2023/07/67764a82cfbc2a655.57868060-e1691690532616.png',
    [[0, 0], [mapHeight, mapWidth]]).addTo(map);

function loadJsonData() {
    $.getJSON("./json/visitors.json", function(jsonData) {
        jsonData.forEach(function(place) {
            var x = place.x;
            var y = mapHeight - place.y; // Apply vertical flip transformation
            var macAddress = place.mac;

            
            var xOffset = Math.floor(Math.random() * 3) * 10 - 20;
            var yOffset = Math.floor(Math.random() * 3) * 10 - 20;

            x += xOffset;
            y += yOffset;

            var markerIcon = L.icon({
                iconUrl: 'https://www.aeroaccess.de/wp-content/uploads/2023/08/pin-lokacija-white.png',
                iconSize: [18, 18],
                iconAnchor: [9, 0],
            });

            var coordinates = [y, x];
            var marker = L.marker(coordinates, { icon: markerIcon });

            marker.bindPopup(macAddress);

            marker.addTo(map);
        });
    });
}

function fetchDataAndRefresh() {
    // Uklonite sve markere sa mape
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    loadJsonData(); // Učitajte novi set podataka
}

// Prvo osvežavanje pri učitavanju stranice
fetchDataAndRefresh();

// Postavljanje intervala za automatsko osvežavanje prikaza svakih 3 sekunde
setInterval(fetchDataAndRefresh, 2000);



$.getJSON("./json/zones.json", function(jsonData) {
    jsonData.forEach(function(entity) {
        var name = entity.name; // Use the mac address as the name
        var numClients = entity.num_clients;
        var vertices = entity.vertices;

        var coordinates = vertices.map(function(vertex) {
            // Apply vertical flip transformation to the vertex coordinates
            var flippedX = vertex.x; // Keep x-coordinate unchanged
            var flippedY = mapHeight - vertex.y; // Flip along the y-axis
            return [flippedY, flippedX];
        });

        // Dodajte prvu tačku na kraj niza kako bismo zatvorili poligon
        coordinates.push(coordinates[0]);

        var polygon = L.polygon(coordinates, { 
            color: '#fff', 
            fillColor: 'rgba(0, 0, 0, 0.9)',
            weight: 3 // Adjust the weight value as desired
        }).addTo(map);
        
        // Kreirajte HTML sadržaj za popup
        var popupContent = "<b>" + name + "</b><br>";
        popupContent += "Total visitors in area: " + numClients;

        polygon.bindPopup(popupContent);
    });
});






