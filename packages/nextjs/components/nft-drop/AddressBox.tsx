import React from 'react';

interface AddressBoxProps {
  title: string;
  address: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isTarget: boolean;
  hoverProgress: number;
  confirmedDrop: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const AddressBox: React.FC<AddressBoxProps> = ({ 
  title, 
  address, 
  icon, 
  children, 
  isTarget, 
  hoverProgress, 
  confirmedDrop, 
  onDragEnter, 
  onDragLeave, 
  onDrop,
  size = "medium",
  color = "from-blue-500 to-purple-500"
}) => {
  // Determine height based on size prop
  const heightClass = 
    size === "small" ? "h-48" : 
    size === "large" ? "h-96" : 
    "h-32"; // medium
  
  // Border class based on state
  const borderClass = 
    confirmedDrop ? "border-2 border-green-400 shadow-lg shadow-green-500/50" :
    isTarget ? "border-2 border-cyan-400 shadow-lg shadow-cyan-500/50" :
    "border border-gray-700";
  
  // Make the entire container dragover-enabled
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Required for drop to work
    e.stopPropagation();
  };
  
  return (
    <div 
      className={`flex flex-col ${heightClass} p-3 bg-gray-800 rounded-lg ${borderClass} transition-all duration-200 backdrop-blur-sm relative`}
      onDragEnter={onDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Header section */}
      <div className="flex items-center mb-2 z-10">
        <div className={`mr-2 p-1 rounded-full bg-gradient-to-r ${color} text-gray-900`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${color}`}>{title}</h3>
          <div className="text-xs text-gray-400">{address}</div>
        </div>
      </div>
      
      {/* Progress indicator/countdown circle */}
      {isTarget && hoverProgress > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <svg className="w-16 h-16">
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              fill="rgba(0,0,0,0.5)" 
              stroke="#0ff" 
              strokeWidth="2"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke={hoverProgress >= 100 ? "#0f0" : "#0ff"}
              strokeWidth="4"
              strokeDasharray={`${hoverProgress * 1.76} 176`}
              strokeDashoffset="0"
              transform="rotate(-90 32 32)"
              strokeLinecap="round"
            />
            <text 
              x="32" 
              y="36" 
              textAnchor="middle" 
              fill={hoverProgress >= 100 ? "#0f0" : "#0ff"} 
              fontSize="14" 
              fontWeight="bold"
            >
              {hoverProgress >= 100 ? "Drop" : Math.ceil(3 - (hoverProgress/100 * 3))}
            </text>
          </svg>
        </div>
      )}
      
      {/* Content area with glow effect on target */}
      <div 
        className={`flex-1 overflow-auto p-2 rounded ${isTarget ? 'ring-1 ring-cyan-400 shadow-inner shadow-cyan-500/20' : ''}`}
        // These handlers ensure the entire box detects drag events
        onDragEnter={onDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {children}
      </div>
      
      {/* Invisible overlay to ensure drag/drop works everywhere in the box */}
      {isTarget && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: hoverProgress >= 100 ? 'rgba(0, 255, 128, 0.1)' : 'rgba(0, 255, 255, 0.1)',
            boxShadow: hoverProgress >= 100 ? 
              'inset 0 0 20px rgba(0, 255, 128, 0.3)' : 
              'inset 0 0 15px rgba(0, 255, 255, 0.2)'
          }}
        />
      )}
    </div>
  );
};