
import React from 'react';

const NotionIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="currentColor" className={className}>
        <path d="M26.333 5H13a1,1,0,0,0-1,1V33.667a1,1,0,0,0,1.6.8L18,31.8l-4.4-4.2V25.333h8.8a1,1,0,0,0,1-1V5.667A.666.666,0,0,0,22.733,5Z"/>
        <path d="M23.333 5h.667a1,1,0,0,1,1,1V24.333a1,1,0,0,1-1,1h-1a.333.333,0,0,1-.333-.333V5.667A.667.667,0,0,1,23.333,5Z"/>
        <path d="M18 19.333V6.667H13.6a1,1,0,0,0-1,1V19.8l4.4,4.2Z"/>
    </svg>
);

export default NotionIcon;
