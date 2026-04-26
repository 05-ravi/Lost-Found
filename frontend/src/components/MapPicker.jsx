import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Search, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MapPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const locations = [
    { name: 'A Block', lat: 17.3850, lng: 78.4867 },
    { name: 'B Block', lat: 17.3860, lng: 78.4877 },
    { name: 'C Block', lat: 17.3870, lng: 78.4887 },
    { name: 'D Block', lat: 17.3880, lng: 78.4897 },
    { name: 'E Block', lat: 17.3890, lng: 78.4907 },
    { name: 'S Block', lat: 17.3900, lng: 78.4917 },
    { name: 'N Block', lat: 17.3910, lng: 78.4927 },
    { name: 'Canteen', lat: 17.3920, lng: 78.4937 },
    { name: 'Basketball court', lat: 17.3930, lng: 78.4947 },
    { name: 'Readers', lat: 17.3940, lng: 78.4957 },
    { name: 'Sports complex', lat: 17.3950, lng: 78.4967 },
    { name: 'Parking area', lat: 17.3960, lng: 78.4977 },
  ];

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (loc) => {
    onChange({
      text: loc.name,
      lat: loc.lat,
      lng: loc.lng
    });
    setIsOpen(false);
    setSearchTerm('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 relative" ref={dropdownRef}>
      <label className="text-small font-bold text-dark-blue block mb-2 uppercase tracking-wider opacity-70">
        Select Place of Lost
      </label>
      
      {/* Dropdown Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 px-4 bg-white border border-border-custom rounded-input flex items-center justify-between cursor-pointer transition-all hover:border-medium-blue group ${isOpen ? 'ring-2 ring-medium-blue/10 border-medium-blue' : ''}`}
      >
        <div className="flex items-center gap-3">
          <MapPin className={`w-5 h-5 transition-colors ${value?.text ? 'text-medium-blue' : 'text-text-secondary'}`} />
          <span className={`text-body transition-colors ${value?.text ? 'text-dark-blue font-medium' : 'text-text-secondary'}`}>
            {value?.text || 'Select a campus location...'}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] top-full mt-2 w-full bg-white border border-border-custom rounded-card shadow-modal overflow-hidden p-2"
          >
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search places..."
                className="w-full pl-10 pr-4 py-2 bg-secondary-bg border-none rounded-lg text-small focus:ring-1 focus:ring-medium-blue outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.name}
                  onClick={() => handleSelect(loc)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    value?.text === loc.name 
                      ? 'bg-medium-blue/5 text-medium-blue font-bold' 
                      : 'text-text-secondary hover:bg-secondary-bg hover:text-dark-blue'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapIcon className="w-4 h-4 opacity-50" />
                    <span className="text-small">{loc.name}</span>
                  </div>
                  {value?.text === loc.name && <Check className="w-4 h-4" />}
                </div>
              ))}
              {filteredLocations.length === 0 && (
                <div className="p-4 text-center text-tiny text-text-secondary italic">
                  No matches found for "{searchTerm}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-40 bg-secondary-bg rounded-card border border-border-custom overflow-hidden relative flex items-center justify-center grayscale opacity-60">
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/78.4867,17.3850,14,0/400x200?access_token=pk.eyJ1IjoiZGV2YWRldmkiLCJhIjoiY2t1OHB0ZXZoMWZicjJwcGZ0eGV2NHB4biJ9.7_rY_-e_Y_Y_Y_Y_Y_Y_Y_w')] bg-cover" />
        <div className="z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-white/50">
          <MapPin className="w-3.5 h-3.5 text-medium-blue" />
          <p className="text-tiny font-bold text-dark-blue">{value?.text || 'VJIT Campus Map'}</p>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
