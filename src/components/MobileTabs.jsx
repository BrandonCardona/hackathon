import React, { useState } from 'react';
import './MobileTabs.css';

export default function MobileTabs({ locations, onLocationSelect, onMapOpen }) {
  const [activeTab, setActiveTab] = useState('places');

  // Filter locations by category (you can expand this based on your data structure)
  const getLocationsByCategory = (category) => {
    // For now, we'll use the existing locations and categorize them
    // You can modify this based on your actual data structure
    switch (category) {
      case 'places':
        return locations.filter(loc => !loc.category || loc.category === 'place' || loc.category === 'site');
      case 'restaurants':
        return locations.filter(loc => loc.category === 'restaurant' || loc.type === 'restaurant');
      case 'events':
        return locations.filter(loc => loc.category === 'event' || loc.type === 'event');
      default:
        return locations;
    }
  };

  const tabs = [
    { id: 'places', label: 'Places', icon: '📍' },
    { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
    { id: 'events', label: 'Events', icon: '🎉' }
  ];

  const handleLocationClick = (location) => {
    onLocationSelect(location);
    onMapOpen(); // Open map when location is selected
  };

  return (
    <div className="mobile-tabs">
      <div className="tab-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
        <button className="map-button" onClick={onMapOpen}>
          <span className="map-icon">🗺️</span>
          <span className="map-label">Map</span>
        </button>
      </div>
      
      <div className="tab-content">
        <div className="location-cards">
          {getLocationsByCategory(activeTab).map((location, index) => (
            <div 
              key={index}
              className="location-card"
              onClick={() => handleLocationClick(location)}
            >
              <div className="card-header">
                <h3 className="card-title">{location.name}</h3>
                <span className="card-category">{activeTab}</span>
              </div>
              <p className="card-description">{location.description}</p>
              <div className="card-footer">
                <span className="card-action">Tap to view on map</span>
                <span className="card-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
