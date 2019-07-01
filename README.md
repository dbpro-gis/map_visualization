# map_visualization
Visualization of map and annotations


This is the Frontend for the map visualization of annotated satellite image tiles.

The basic map is retrieved from OpenStreetMap API

There is an EventListener added to the map, so for every change, e.g. zoom or move the bounds are updated and correspondent coordinates are requested at GeoServer. The coordinates and correspondent predictions are transfered via GeoJson and then added to the map as layers.

The legend at bottom left displays the correspondent class for every layer-color

-------

To view the map visualization just open the html file.
