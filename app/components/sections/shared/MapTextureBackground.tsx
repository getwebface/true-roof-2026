// MapTextureBackground.tsx
// Geographic context texture for local service sections
import * as React from 'react';

const MapTextureBackground: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="map-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#map-grid)" />
    </svg>
  </div>
);

export default MapTextureBackground;
