var json = {};
window.onload = function() {
    var map = L.map('map').setView([52.5204, 13.3947], 12);
    
		var update = function onDragEnd() {
			var east = map.getBounds().getEast()
			var west = map.getBounds().getWest();
			var north = map.getBounds().getNorth()
			var south = map.getBounds().getSouth();

			console.log(
				'east:' + east + '	west:' + west + 'north:' + north + '	south:' + south
			)
			
			$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Aforest_fixed&maxFeatures=1000000&bbox=' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
				function(data) {
                    console.log("ja 1")
                    console.log(json)
                    

					console.log("test2")
					L.geoJSON(data, {
						style: myStyle
                    }).addTo(map);
                    console.log("ja 2")
                    console.log(json);
				}, 'json');
        }
        
 
		map.on('moveend', update);
		map.whenReady(update);

    
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href=”http://osm.org/copyright”>OpenStreetMap</a> contributors'
        }).addTo(map);
    
		
		var legend = L.control({ position: 'bottomleft' });
		legend.onAdd = adder;
        legend.addTo(map);
    }

    var myStyle = function(feature) {
		
        switch (feature.properties.prediction) {
            case "11": return { color: "yellow"};
			case "12": return { color: "lightyellow"};
			case "13": return { color: "khaki"};
			case "14": return { color: "palegoldenrod"};
                
            case "21": return { color: "red"};
			case "22": return { color: "crimson"};
			case "23": return { color: "indianred"};
			case "24": return { color: "lightcarol"};
                
            case "31": return { color: "green" };
			case "32": return { color: "limegreen" };
			case "33": return { color: "lime" };
                
            case "41": return { color: "olive" };
			case "42": return { color: "olivedrab" };
                
            case "51": return { color: "blue" };
			case "52": return { color: "lightblue" };
                
            default: return { color: "lightgray" };
                
        }
    }

    var adder = function() {
			var div = L.DomUtil.create('div', 'legend');

			var labels = [{
					farbe: 'Yellow',
					inhalt: 'Urban fabric'
				},
				{
					farbe: 'LightYellow',
					inhalt: 'Industrial, commercial and transport units'
				},
				{
					farbe: 'Khaki',
					inhalt: 'Mine, dump and construction sites'
				},
				{
					farbe: 'Palegoldenrod',
					inhalt: 'Artificial, non-agricultural vegetated areas'
				},
				{
					farbe: 'Red',
					inhalt: 'Arable land'
				},
				{
					farbe: 'Crimson',
					inhalt: 'Permanent crops'
				},
				{
					farbe: 'Indianred',
					inhalt: 'Pastures'
				},
				{
					farbe: 'Lightcoral',
					inhalt: 'Heterogeneous agricultural areas'
				},
				{
					farbe: 'Green',
					inhalt: 'Forest'
				},
				{
					farbe: 'Limegreen',
					inhalt: 'Shrub and/or herbaceous vegetation'
				},
				{
					farbe: 'Lime',
					inhalt: 'Open spaces with little or no vegetation'
				},
				{
					farbe: 'Olive',
					inhalt: 'Inland wetlands'
				},
				{
					farbe: 'Olivedrab',
					inhalt: 'Coastal wetlands'
				},
				{
					farbe: 'Blue',
					inhalt: 'Inland waters'
				},
				{
					farbe: 'Lightblue',
					inhalt: 'Marine waters'
				},
				{
					farbe: 'Lightgray',
					inhalt: 'Others'
				},
			];


			for (var i = 0; i < labels.length; i++) {
				var li = L.DomUtil.create('li', 'list', div);
				li.innerHTML = labels[i].farbe + ': ' + labels[i].inhalt;
				li.style.backgroundColor = labels[i].farbe;
			}
			return div;
		}