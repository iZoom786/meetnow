
import React from 'react';

const MicIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v.75a7.5 7.5 0 0 1-7.5 7.5h-.01a7.5 7.5 0 0 1-7.49-7.5v-.75m15 0a7.49 7.49 0 0 0-4.43-6.817l-1.06-3.483a.75.75 0 0 0-1.42.434l1.06 3.483a7.5 7.5 0 0 0-8.16 0l1.06-3.483a.75.75 0 0 0-1.42-.434l-1.06 3.483A7.49 7.49 0 0 0 4.5 14.25" />
  </svg>
);

export default MicIcon;
