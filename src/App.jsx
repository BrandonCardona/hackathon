import { useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PreviewBar from "./components/PreviewBar";
import MobileTabs from "./components/MobileTabs";
import MobileMap from "./components/MobileMap";
import RightSidebar from "./components/RightSidebar";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Heatmap from "ol/layer/Heatmap";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style, Fill, Stroke } from "ol/style";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import LineString from "ol/geom/LineString";
import Overlay from "ol/Overlay";
import "./App.css";
import locationData from "./data/locations.json";

export default function App() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [map, setMap] = useState(null);
  const [locations] = useState(locationData.locations);
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [routeLayer, setRouteLayer] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null); // Estado para la ruta seleccionada
  const [isConectaView, setIsConectaView] = useState(false);
  const [showPoints, setShowPoints] = useState(true); // Add this state
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Ejemplo de paquetes turísticos
  const [packages] = useState([
    {
      name: "Ruta Centro Histórico",
      description:
        "Recorre los principales sitios históricos y culturales de Ibagué.",
      agency: "Agencia Ibagué Tours",
      points: [
        "Plaza de Bolívar (Ibagué)",
        "Catedral Primada de Ibagué (Inmaculada Concepción)",
        "Museo de Arte del Tolima (MAT)",
        "Panóptico de Ibagué (Complejo Cultural)",
        "Parque Centenario",
      ],
    },
    {
      name: "Ruta Naturaleza y Miradores",
      description: "Explora los paisajes naturales y miradores de la ciudad.",
      agency: "Tolima Natural",
      points: [
        "Jardín Botánico San Jorge",
        "Cañón del Combeima",
        "Mirador de Juntas",
        "Nevado del Tolima",
      ],
    },
    {
      name: "Ruta Gastronómica",
      description: "Descubre los mejores restaurantes y sabores locales.",
      agency: "Sabores de Ibagué",
      points: [
        "Restaurante Madre Monte Mirador",
        "L'italiano Restaurante Pizzeria Cafe",
        "Restaurante Altavista",
      ],
    },
    {
      name: "Ruta de Compras y Diversión",
      description:
        "Visita los principales centros comerciales y parques de la ciudad.",
      agency: "Ibagué Shopping",
      points: [
        "Centro Comercial Multicentro",
        "La Estación Centro Comercial",
        "Aqua Power Park",
      ],
    },
    {
      name: "Ruta Cultural y Música",
      description: "Sumérgete en la cultura y música de Ibagué.",
      agency: "Cultura Tolimense",
      points: ["Conservatorio del Tolima", "Parque de la Música", "ToliJazz"],
    },
  ]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    if (map) {
      const coordinates = fromLonLat(location.coordinates);
      map.getView().animate({
        center: coordinates,
        zoom: 15,
        duration: 1000,
      });
    }
  };

  const handleMobileMapOpen = () => {
    setIsMobileMapOpen(true);
  };

  const handleMobileMapClose = () => {
    setIsMobileMapOpen(false);
  };

  const handleNavbarVisibility = useCallback((hidden) => {
    setIsNavbarHidden(hidden);
  }, []);

  // Función para manejar la visualización de la ruta
  const handleViewRoute = (pkg) => {
    if (!map) return;

    // Mostrar detalles de la ruta
    setSelectedRoute(pkg);

    // Buscar los puntos en locations
    const routePoints = pkg.points
      .map((name) => locations.find((loc) => loc.name === name))
      .filter(Boolean);
    if (routePoints.length < 2) return;

    // Crear geometría de línea
    const coordinates = routePoints.map((loc) => fromLonLat(loc.coordinates));
    const routeFeature = new Feature({
      geometry: new window.ol.geom.LineString(coordinates),
      name: pkg.name,
    });

    // Estilo con gradiente y sombra
    routeFeature.setStyle(
      new Style({
        stroke: new window.ol.style.Stroke({
          color: "#1976d2",
          width: 6,
          lineDash: [10, 8],
          lineCap: "round",
        }),
      })
    );

    // Crear features para los puntos de la ruta
    const pointFeatures = coordinates.map((coord, idx) => {
      return new Feature({
        geometry: new Point(coord),
        name: routePoints[idx].name,
      });
    });

    // Eliminar capa de ruta anterior si existe
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    // Crear nueva capa vectorial para la ruta y los puntos
    const newRouteLayer = new VectorLayer({
      source: new VectorSource({ features: [routeFeature, ...pointFeatures] }),
      zIndex: 100,
    });
    map.addLayer(newRouteLayer);
    setRouteLayer(newRouteLayer);

    // Centrar el mapa en la ruta
    map.getView().fit(routeFeature.getGeometry().getExtent(), {
      padding: [60, 60, 60, 340],
      duration: 800,
      maxZoom: 15,
    });
  };

  // Función para quitar las rutas del mapa
  const handleRemoveRoute = () => {
    if (routeLayer && map) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }
    setSelectedRoute(null); // Limpiar la ruta seleccionada
  };

  // Add this function to handle toggle
  const handleTogglePoints = useCallback(() => {
    setShowPoints((prev) => !prev);
    if (map) {
      // Only toggle vector and heatmap layers, not the base map
      map.getLayers().forEach((layer) => {
        if (layer instanceof VectorLayer && !(layer instanceof Heatmap)) {
          layer.setVisible(!showPoints);
        }
      });
    }
  }, [map, showPoints]);

  const handleToggleHeatmap = useCallback(() => {
    setShowHeatmap((prev) => !prev);
    if (map) {
      map.getLayers().forEach((layer) => {
        if (layer instanceof Heatmap) {
          layer.setVisible(!showHeatmap);
        }
      });
    }
  }, [map, showHeatmap]);

  useEffect(() => {
    if (isConectaView) {
      // Clean up map when switching to Conecta view
      if (map) {
        map.setTarget(undefined);
        setMap(null);
      }
      return;
    }

    // Para compatibilidad con window.ol en handleViewRoute
    window.ol = { geom: { LineString }, style: { Stroke } };

    const ibagueCoords = [-75.2322, 4.4389];
    const ibagueWebMercator = fromLonLat(ibagueCoords);

    // Sample visit data with weights
    const visitData = locations.map((location) => ({
      ...location,
      weight: Math.random() * 100, // Random weight for demonstration
    }));

    // Create features for heatmap
    const heatmapFeatures = visitData.map((point) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(point.coordinates)),
        weight: point.weight,
      });
      // Set properties directly on the feature
      feature.setProperties({
        name: point.name,
        description: point.description,
        visits: point.visits,
        weight: point.weight,
        Imagen: point.Imagen,
      });
      return feature;
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
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          scale: 0.5,
        }),
      }),
      visible: showPoints, // Add this line
    });

    const heatmapLayer = new Heatmap({
      source: new VectorSource({
        features: heatmapFeatures,
      }),
      blur: 15,
      radius: 10,
      weight: function (feature) {
        return feature.get("weight");
      },
      visible: showPoints, // Add this line
    });

    // Create popup overlay
    const popup = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      offset: [0, -10],
      stopEvent: false,
    });

    const mapInstance = new Map({
      target: mapRef.current,
      pixelRatio: 1,
      layers: [
        // Base map layer (always visible)
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
          }),
          renderMode: "image",
          visible: true, // Always visible
        }),
        // Points and heatmap layers (toggleable)
        new Heatmap({
          source: new VectorSource({
            features: heatmapFeatures,
          }),
          blur: 15,
          radius: 10,
          weight: function (feature) {
            return feature.get("weight");
          },
          visible: showPoints,
        }),
        vectorLayer,
      ],
      overlays: [popup],
      view: new View({
        center: ibagueWebMercator,
        zoom: 9,
        maxZoom: 18,
        minZoom: 7,
      }),
    });

    // Add hover interaction
    mapInstance.on("pointermove", function (e) {
      const feature = mapInstance.forEachFeatureAtPixel(
        e.pixel,
        function (feature) {
          return feature;
        }
      );

      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        popupRef.current.innerHTML = `
          <div class="popup-content">
            <div class="popup-title">${
              feature.get("name") || "Unnamed Location"
            }</div>
            <div class="popup-description">${
              feature.get("description") || "No description available"
            }</div>
            ${
              feature.get("Imagen")
                ? `<img src="${feature.get(
                    "Imagen"
                  )}" alt="Imagen de ${feature.get(
                    "name"
                  )}" class="popup-image" style="width: 100px; height: 80px; object-fit: cover; border-radius: 8px; margin-top: 5px;" />`
                : ""
            }
            ${
              feature.get("visits")
                ? `<div class="popup-visits">Visits: ${feature.get(
                    "visits"
                  )}</div>`
                : `<div class="popup-visits">Weight: ${feature
                    .get("weight")
                    .toFixed(0)}</div>`
            }
            </div>
            `;
        popupRef.current.style.display = "block";
      } else {
        popupRef.current.style.display = "none";
      }
    });

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.setTarget(undefined);
      }
    };
  }, [locations, isConectaView, showPoints]); // Add showPoints dependency

  return (
    <div className="app">
      <PreviewBar />
      <Navbar
        onVisibilityChange={handleNavbarVisibility}
        isConectaView={isConectaView}
        setIsConectaView={setIsConectaView}
      />
      {!isConectaView ? (
        <div className={`map-section ${isNavbarHidden ? "navbar-hidden" : ""}`}>
          {/* Add toggle switch */}
          <div
            className="map-controls"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1000,
              background: "white",
              padding: "5px",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={showPoints}
                onChange={handleTogglePoints}
              />
              Mostrar Puntos
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={handleToggleHeatmap}
              />
              Mostrar Mapa de Calor
            </label>
          </div>
          <Sidebar
            locations={locations}
            onLocationSelect={handleLocationSelect}
          />
          <div className="map-container">
            <div ref={mapRef} className="map"></div>
            <div
              ref={popupRef}
              className="popup"
              style={{ display: "none" }}
            ></div>
          </div>
          <MobileTabs
            locations={locations}
            onLocationSelect={handleLocationSelect}
            onMapOpen={handleMobileMapOpen}
          />
          {!isConectaView && (
            <RightSidebar packages={packages} onViewRoute={handleViewRoute} />
          )}
          {routeLayer && (
            <button onClick={handleRemoveRoute} className="remove-route-btn">
              Quitar Rutas
            </button>
          )}
          {selectedRoute && (
            <div className="route-details">
              <h2>{selectedRoute.name}</h2>
              <p>{selectedRoute.description}</p>
              <h3>Puntos de la ruta:</h3>
              <ul>
                {selectedRoute.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <p>
                <strong>¿Por qué hacer esta ruta?</strong> {selectedRoute.agency}{" "}
                ha diseñado esta experiencia para que disfrutes de{" "}
                {selectedRoute.name}.
              </p>
            </div>
          )}
        </div>
      ) : null}
      <MobileMap
        isOpen={isMobileMapOpen}
        onClose={handleMobileMapClose}
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}

