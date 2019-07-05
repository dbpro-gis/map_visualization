var change = true;
var map;
var tileLayer;
var geojsonLayer;
var geojsonLayer2;
var legend;
window.onload = function() {
 		map = L.map('map').setView([52.5204, 13.3947], 6);
    	
		map.on('moveend', function() {
			if(change){
				//removelayer
				updateCNN();
			}else{
				//removelayer
				updateKNN();
			}		
		});
		map.whenReady(function() {
			if(change){
				//removelayer
				updateCNN();
			}else{
				//removelayer
				updateKNN();
			}
		});



    
		tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href=”http://osm.org/copyright”>OpenStreetMap</a> contributors'
		})
		tileLayer.addTo(map);
    
		
		legend = L.control({ position: 'bottomleft' });
		legend.onAdd = adder;
        legend.addTo(map);
	}

	function updateCNN() {
		change = true;
		map.eachLayer(function(layer) {
			if( !(layer instanceof L.TileLayer )){
				console.log("remove:  " + layer)
				map.removeLayer(layer);
			}				
		});
	
		var east = map.getBounds().getEast()
		var west = map.getBounds().getWest();
		var north = map.getBounds().getNorth()
		var south = map.getBounds().getSouth();
		console.log("update cnn")
		if(map.getZoom()<=9){
			console.log("zoom <10")
			
							
				$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Aprediction_overview&maxFeatures=1000000&bbox' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
				function(data) {		
					
				geojsonLayer = L.geoJSON(data.features[0], {
					style: {color: "black"}
				})																								
				geojsonLayer.addTo(map);
			}, 'json');
		
		}					
		else{
			console.log("zoom >=10")
		$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Acnn_final_2019&maxFeatures=1000000&bbox=' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
			function(data) {								
				geojsonLayer2 = L.geoJSON(data, {
					style: myStyle
				})
				geojsonLayer2.addTo(map);
			}, 'json');
			
		}
	}

	function changeLegend(){
			map.removeControl(legend);
			legend = L.control({ position: 'bottomleft' });

			if(change) legend.onAdd = adder2;
			else legend.onAdd = adder;
        					
			legend.addTo(map);
	}

	function changetoCNN(){
		map.flyTo([52.5204, 13.3947], 6)
		changeLegend();
		updateCNN();
	}

	function changetoKNN(){
		map.flyTo([52.5204, 13.3947], 6)
		changeLegend();
		updateKNN();	
	}
	
	function updateKNN() {
		map.eachLayer(function(layer) {
			if( !(layer instanceof L.TileLayer )){
				console.log("remove:  " + layer)
				map.removeLayer(layer);
			}				
		});
		change = false;
		
		var east = map.getBounds().getEast()
		var west = map.getBounds().getWest();
		var north = map.getBounds().getNorth()
		var south = map.getBounds().getSouth();
		console.log("update knn")
		if(map.getZoom()<10){
			console.log("zoom <10")
			
							
				$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Aprediction_overview&maxFeatures=1000000&bbox=' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
				function(data) {		
				geojsonLayer = L.geoJSON(data.features[1], {
					style: {color: "black"}
				})																								
				geojsonLayer.addTo(map);
			}, 'json');
		
		}					
		else{
			console.log("zoom >=10")
		$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Aprediction_knn_test&maxFeatures=1000000&bbox=' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
			function(data) {
				console.log(data)								
				geojsonLayer2 = L.geoJSON(data, {
					style: myStyle2
				})
				geojsonLayer2.addTo(map);
			}, 'json');
			
		}
	}
	
	var myStyle2 = function(feature){
		console.log("styleeeeeeeeeeeee")
		switch (feature.properties.prediction) {
			case "1": console.log("1");
			return { color: "yellow", weight: "0", weight : "none"};
			               
            case "2": return { color: "red", weight: "0"};			
                
            case "3": return { color: "green", weight: "0"};
			
            case "4": return { color: "olive", weight: "0" };
			
            case "5": return { color: "blue", weight: "0" };
			   
            default: return { color: "lightgray", weight: "0" };
                
        }
	}

    var myStyle = function(feature) {
		
        switch (feature.properties.prediction) {
            case "11": return { color: "yellow", weight: "0", weight : "0"};
			case "12": return { color: "lightyellow", weight: "0"};
			case "13": return { color: "khaki", weight: "0"};
			case "14": return { color: "palegoldenrod", weight: "0"};
                
            case "21": return { color: "red", weight: "0"};
			case "22": return { color: "crimson", weight: "0"};
			case "23": return { color: "indianred", weight: "0"};
			case "24": return { color: "lightcarol", weight: "0"};
                
            case "31": return { color: "green", weight: "0"};
			case "32": return { color: "limegreen", weight: "0" };
			case "33": return { color: "lime", weight: "0" };
                
            case "41": return { color: "olive", weight: "0" };
			case "42": return { color: "olivedrab", weight: "0" };
                
            case "51": return { color: "blue", weight: "0" };
			case "52": return { color: "lightblue", weight: "0" };
                
            default: return { color: "lightgray", weight: "0" };
                
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

		var adder2 = function() {
			var div = L.DomUtil.create('div', 'legend');

			var labels = [{
					farbe: 'Yellow',
					inhalt: 'Artificial'
				},
				{
					farbe: 'Red',
					inhalt: 'Agricultural'
				},
				{
					farbe: 'Green',
					inhalt: 'Forest'
				},
				{
					farbe: 'Olive',
					inhalt: 'Wetlands'
				},
				{
					farbe: 'Blue',
					inhalt: 'Water'
				},
			];


			for (var i = 0; i < labels.length; i++) {
				var li = L.DomUtil.create('li', 'list', div);
				li.innerHTML = labels[i].farbe + ': ' + labels[i].inhalt;
				li.style.backgroundColor = labels[i].farbe;
			}
			return div;
		}