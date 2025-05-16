import React from 'react';
import { Clock } from 'lucide-react';
import { NFT, TransferState } from './types';

interface NFTCardProps {
  nft: NFT;
  className: string;
  isDragging: boolean;
  transferState: TransferState;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ 
  nft, 
  className, 
  isDragging, 
  transferState, 
  onDragStart 
}) => {
  return (
    <div 
      className={`${className} ring-1 ring-gray-700 bg-gray-800`}
      draggable
      onDragStart={onDragStart}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${nft.color} opacity-30 hover:opacity-40 transition-opacity`}></div>
      <img 
        src={nft.image} 
        alt={`NFT ${nft.tokenId}`} 
        className="w-24 h-24 object-cover mix-blend-luminosity"
      />
      <div className={`absolute top-1 left-1 bg-gradient-to-r ${nft.color} text-gray-900 text-xs px-2 py-1 rounded-md font-bold shadow-lg`}>
        {nft.tokenId}
      </div>
      
      {/* Transfer state indicators */}
      {isDragging && transferState === 'pending' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <Clock className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
      )}
      
      {/* Glow effect when dragging */}
      {isDragging && !transferState && (
        <div className="absolute inset-0 ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50 rounded-md"></div>
      )}
    </div>
  );
};