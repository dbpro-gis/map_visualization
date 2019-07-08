var change = true;
var map;
var tileLayer;
var geojsonLayer;
var geojsonLayer2;
var legend;
window.onload = function() {
 		map = L.map('map').setView([52.5204, 13.3947], 6);
		
		 /*
		 EventListener für Bewegungen/Zoom in der Karte
		 */
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



		/*
		Einfügen der ungelabelten Map
		*/
		tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href=”http://osm.org/copyright”>OpenStreetMap</a> contributors'
		})
		tileLayer.addTo(map);
    
		/*
		Legende
		*/
		legend = L.control({ position: 'bottomleft' });
		legend.onAdd = adder;
        legend.addTo(map);
	}

	/*
	Labels hinzufügen bzw entfernen
	*/
	function layerControl(){
		var control = document.getElementById("3");
		if(control.value == "Delete Labels"){
			removeLayer();
			control.value = "Add Labels"
		}else{
			if(change) updateCNN();
			else updateKNN();
			control.value = "Delete Labels"
		}		
	}

	/*
	Labels entfernen
	*/
	function removeLayer(){
		map.eachLayer(function(layer) {
			if( !(layer instanceof L.TileLayer )) map.removeLayer(layer);					
		});
	}

	/*
	CNN-Labels in neuem Bereich laden
	*/
	function updateCNN() {
		removeLayer();
		change = true;
		
	
		var east = map.getBounds().getEast()
		var west = map.getBounds().getWest();
		var north = map.getBounds().getNorth()
		var south = map.getBounds().getSouth();
	/*
	Overview für niedriges Zoom-Level in Karte laden
	*/
		if(map.getZoom()<=9){			
				$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Aprediction_overview&maxFeatures=1000000&bbox' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
				function(data) {							
				geojsonLayer = L.geoJSON(data.features[0], {
					style: {color: "black"}
				})																								
				geojsonLayer.addTo(map);
			}, 'json');
		
		}					
		else{
		/*
		Detailliertere Labels für entsprechenden Bereich
		*/
		$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Acnn_final_2019&maxFeatures=1000000&bbox=' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
			function(data) {								
				geojsonLayer2 = L.geoJSON(data, {
					style: myStyle
				})
				geojsonLayer2.addTo(map);
			}, 'json');
			
		}
	}

	/*
	Legende für ausgewählten Modus (CNN / KNN) wechseln
	*/
	function changeLegend(){
			map.removeControl(legend);
			legend = L.control({ position: 'bottomleft' });

			if(change) legend.onAdd = adder2;
			else legend.onAdd = adder;
        					
			legend.addTo(map);
	}

	/*
	Wechseln des Modus zu CNN
	*/
	function changetoCNN(){
		changeLegend();
		updateCNN();
	}

	/*
	Wechseln des Modus zu KNN
	*/
	function changetoKNN(){
		changeLegend();
		updateKNN();	
	}
	
	/*
	KNN-Labels in neuem Bereich laden
	*/
	function updateKNN() {
		removeLayer();
		change = false;
		
		var east = map.getBounds().getEast()
		var west = map.getBounds().getWest();
		var north = map.getBounds().getNorth()
		var south = map.getBounds().getSouth();
		
		/*
		Overview für niedriges Zoom-Level in Karte laden
		*/
		if(map.getZoom()<10){
				$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Aprediction_overview&maxFeatures=1000000&bbox=' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
				function(data) {		
				geojsonLayer = L.geoJSON(data.features[1], {
					style: {color: "black"}
				})																								
				geojsonLayer.addTo(map);
			}, 'json');
		
		}	
		/*
		Detailliertere Labels für entsprechenden Bereich
		*/				
		else{
		$.get('http://home.arsbrevis.de:31312/geoserver/dbpro/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dbpro%3Aprediction_knn_test&maxFeatures=1000000&bbox=' + west + ',' + east + ',' + south + ',' + north + '&outputFormat=application%2Fjson',
			function(data) {							
				geojsonLayer2 = L.geoJSON(data, {
					style: myStyle2
				})
				geojsonLayer2.addTo(map);
			}, 'json');
			
		}
	}
	
	/*
	Style für KNN-Legende
	*/
	var myStyle2 = function(feature){
		switch (feature.properties.prediction) {
			case "1": return { color: "yellow", weight: "0", weight : "none"};
			               
            case "2": return { color: "red", weight: "0"};			
                
            case "3": return { color: "green", weight: "0"};
			
            case "4": return { color: "olive", weight: "0" };
			
            case "5": return { color: "blue", weight: "0" };
			   
            default: return { color: "lightgray", weight: "0" };
                
        }
	}

	/*
	Style für CNN-Legende
	*/
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

	/*
	Hinzufügen von CNN-Legende
	*/
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

		/*
		Hinzufügen von KNN-Legende
		*/
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