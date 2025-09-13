import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Heatmap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style, Fill } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import './MobileMap.css';

export default function MobileMap({ isOpen, onClose, locations, selectedLocation, onLocationSelect }) {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    const ibagueCoords = [-75.2322, 4.4389];
    const ibagueWebMercator = fromLonLat(ibagueCoords);

    // Sample visit data with weights
    const visitData = locations.map(location => ({
      ...location,
      weight: Math.random() * 100 // Random weight for demonstration
    }));

    // Create features for heatmap
    const heatmapFeatures = visitData.map(point => {
      return new Feature({
        geometry: new Point(fromLonLat(point.coordinates)),
        weight: point.weight,
        name: point.name,
        description: point.description
      });
    });

    // Create vector source and layer for points
    const vectorSource = new VectorSource({
      features: heatmapFeatures,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 0.5
        })
      })
    });

    // Create heatmap layer
    const heatmapLayer = new Heatmap({
      source: new VectorSource({
        features: heatmapFeatures,
      }),
      blur: 15,
      radius: 10,
      weight: function(feature) {
        return feature.get('weight');
      }
    });

    // Create popup overlay
    const popup = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      offset: [0, -10],
      stopEvent: false
    });

    const mapInstance = new Map({
      target: mapRef.current,
      pixelRatio: 1,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'
          }),
          renderMode: 'image'
        }),
        heatmapLayer,
        vectorLayer
      ],
      overlays: [popup],
      view: new View({
        center: ibagueWebMercator,
        zoom: 9,
        maxZoom: 18,
        minZoom: 7
      }),
    });

    // Add click interaction
    mapInstance.on('click', function(e) {
      const feature = mapInstance.forEachFeatureAtPixel(e.pixel, function(feature) {
        return feature;
      });

      if (feature) {
        const location = {
          name: feature.get('name'),
          description: feature.get('description'),
          coordinates: feature.getGeometry().getCoordinates()
        };
        onLocationSelect(location);
      }
    });

    // Add hover interaction
    mapInstance.on('pointermove', function(e) {
      const feature = mapInstance.forEachFeatureAtPixel(e.pixel, function(feature) {
        return feature;
      });

      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        popupRef.current.innerHTML = `
          <div class="popup-title">${feature.get('name')}</div>
          <div>${feature.get('description')}</div>
        `;
        popupRef.current.style.display = 'block';
      } else {
        popupRef.current.style.display = 'none';
      }
    });

    setMap(mapInstance);

    return () => mapInstance.setTarget(undefined);
  }, [isOpen, locations, onLocationSelect]);

  // Center map on selected location
  useEffect(() => {
    if (map && selectedLocation) {
      const coordinates = fromLonLat(selectedLocation.coordinates);
      map.getView().animate({
        center: coordinates,
        zoom: 15,
        duration: 1000
      });
    }
  }, [map, selectedLocation]);

  if (!isOpen) return null;

  return (
    <div className="mobile-map-overlay">
      <div className="mobile-map-container">
        <div className="mobile-map-header">
          <h2>Map View</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div ref={mapRef} className="mobile-map"></div>
        <div ref={popupRef} className="popup" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
}
