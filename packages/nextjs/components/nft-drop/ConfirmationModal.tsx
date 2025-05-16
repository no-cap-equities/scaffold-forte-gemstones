import React from 'react';
import { X } from 'lucide-react';
import { PendingTransfer, NFT } from './types';

interface ConfirmationModalProps {
  show: boolean;
  pendingTransfer: PendingTransfer | null;
  nfts: NFT[];
  onConfirm: (confirmed: boolean) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  pendingTransfer,
  nfts,
  onConfirm
}) => {
  if (!show || !pendingTransfer) return null;

  const nft = nfts.find(n => n.id === pendingTransfer.nftId);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 border border-gray-600 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-400">Confirm Transfer</h2>
          <button 
            onClick={() => onConfirm(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="mb-4">Are you sure you want to transfer this NFT?</p>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-900 rounded-md">
            <img 
              src={nft?.image || ''} 
              alt={`NFT ${pendingTransfer.tokenId}`}
              className="w-16 h-16 object-cover rounded-md" 
            />
            <div>
              <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {pendingTransfer.tokenId}
              </div>
              <div className="text-sm text-gray-400">
                <span>From: <span className="text-pink-400">{pendingTransfer.fromAddress}</span></span>
              </div>
              <div className="text-sm text-gray-400">
                <span>To: <span className="text-green-400">{pendingTransfer.toAddress}</span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-gray-900 font-bold rounded-md transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};