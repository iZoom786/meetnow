
import React from 'react';

const HubspotIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
    <path fill="#FF7A59" d="M128 0C57.31 0 0 57.31 0 128s57.31 128 128 128 128-57.31 128-128S198.69 0 128 0zm0 240C66.42 240 16 189.58 16 128S66.42 16 128 16s112 50.42 112 112-50.42 112-112 112z"/>
    <path fill="#FF7A59" d="M136.5 120.31a8.5 8.5 0 0 0-17 0V159.5h17zM119.5 88.81a8.5 8.5 0 0 0 17 0V50h-17z"/>
    <path fill="#FF7A59" d="M111.69 136.5a8.5 8.5 0 0 0 0 17H72.5v-17zM167.19 119.5a8.5 8.5 0 0 0 0-17H206v17z"/>
  </svg>
);

export default HubspotIcon;
