import React, { useState, useEffect, useRef } from 'react';
import { Move, Wallet, Archive, Clock, CheckCircle, AlertCircle, ZapIcon, X } from 'lucide-react';

// Main App Component
const NFTTransferApp = () => {
  // Sample data - in a real app, this would come from blockchain/API
  const [addresses] = useState({
    admin: '0x1234...5678',
    vault: '0xabcd...ef01',
    userA: '0x2345...6789',
    userB: '0x3456...789a',
    userC: '0x4567...89ab',
    userD: '0x5678...9abc',
  });

  // NFT data with current owners
  const [nfts, setNfts] = useState([
    { id: 1, tokenId: '#1234', image: '/api/placeholder/120/120', owner: 'admin', color: 'from-pink-500 to-purple-500' },
    { id: 2, tokenId: '#2345', image: '/api/placeholder/120/120', owner: 'admin', color: 'from-cyan-400 to-blue-500' },
    { id: 3, tokenId: '#3456', image: '/api/placeholder/120/120', owner: 'vault', color: 'from-green-400 to-emerald-500' },
    { id: 4, tokenId: '#4567', image: '/api/placeholder/120/120', owner: 'vault', color: 'from-yellow-400 to-orange-500' },
    { id: 5, tokenId: '#5678', image: '/api/placeholder/120/120', owner: 'vault', color: 'from-pink-500 to-rose-500' },
    { id: 6, tokenId: '#6789', image: '/api/placeholder/120/120', owner: 'userA', color: 'from-indigo-400 to-violet-500' },
    { id: 7, tokenId: '#7890', image: '/api/placeholder/120/120', owner: 'userB', color: 'from-blue-400 to-cyan-500' },
    { id: 8, tokenId: '#8901', image: '/api/placeholder/120/120', owner: 'userC', color: 'from-fuchsia-400 to-pink-500' },
  ]);

  // Transaction history
  const [transactions, setTransactions] = useState([
    { id: 1, from: 'admin', to: 'userA', tokenId: '#6789', status: 'success', timestamp: '2 hours ago' },
    { id: 2, from: 'vault', to: 'userB', tokenId: '#7890', status: 'success', timestamp: '1 hour ago' },
    { id: 3, from: 'vault', to: 'userC', tokenId: '#8901', status: 'failed', timestamp: '30 minutes ago' },
  ]);

  // UI state management
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [draggedNft, setDraggedNft] = useState(null);
  const [targetBox, setTargetBox] = useState(null);
  const [hoverTime, setHoverTime] = useState(0);
  const [transferState, setTransferState] = useState(null); // null, 'pending', 'success', 'failed'
  const [confirmedDrop, setConfirmedDrop] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState(null);
  
  // Timer references
  const hoverTimerRef = useRef(null);
  const originalPositionRef = useRef(null);

  // Simulated transfer function
  const executeTransfer = (nftId, toAddress) => {
    setTransferState('pending');
    
    // Simulate blockchain transaction with 50% chance of success
    setTimeout(() => {
      const success = Math.random() > 0.5;
      
      if (success) {
        setTransferState('success');
        // Update NFT ownership
        setNfts(prev => 
          prev.map(nft => 
            nft.id === nftId ? {...nft, owner: toAddress} : nft
          )
        );
        
        // Add to transaction history
        const targetNft = nfts.find(n => n.id === nftId);
        setTransactions(prev => [
          {
            id: prev.length + 1,
            from: targetNft.owner,
            to: toAddress,
            tokenId: targetNft.tokenId,
            status: 'success',
            timestamp: 'just now'
          },
          ...prev
        ]);
      } else {
        setTransferState('failed');
        // Add failed transaction to history
        const targetNft = nfts.find(n => n.id === nftId);
        setTransactions(prev => [
          {
            id: prev.length + 1,
            from: targetNft.owner,
            to: toAddress,
            tokenId: targetNft.tokenId,
            status: 'failed',
            timestamp: 'just now'
          },
          ...prev
        ]);
      }
      
      // Reset states after animation completes
      setTimeout(() => {
        setDraggedNft(null);
        setTargetBox(null);
        setHoverTime(0);
        setTransferState(null);
        setConfirmedDrop(false);
      }, 1000);
    }, 2000); // Simulate blockchain confirmation time
  };

  // Handle drag start
  const handleDragStart = (nftId, e) => {
    setDraggedNft(nftId);
    originalPositionRef.current = nfts.find(n => n.id === nftId).owner;
    
    // Clear any existing hover timer
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // Handle drag enter box
  const handleDragEnter = (boxId, e) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const draggedNftData = nfts.find(n => n.id === draggedNft);
    
    // Don't allow dropping in current owner's box
    if (!draggedNftData || draggedNftData.owner === boxId) {
      setTargetBox(null);
      return;
    }
    
    setTargetBox(boxId);
    
    // Start hover timer
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
    }
    
    // Reset timer and start from 0
    setHoverTime(0);
    
    // Update approximately 30 times per second, increment by 100/90 per update
    // This should give us a full 3 seconds (90 frames at 30fps)
    hoverTimerRef.current = setInterval(() => {
      setHoverTime(prev => {
        // If we've reached 100%, stop the timer and confirm drop
        if (prev >= 100) {
          clearInterval(hoverTimerRef.current);
          hoverTimerRef.current = null;
          setConfirmedDrop(true);
          return 100;
        }
        // Otherwise, increment by a small amount (100/90 = ~1.11 per frame)
        return prev + (100/90);
      });
    }, 33.33); // ~30 frames per second (1000ms / 30 = 33.33ms)
  };

  // Handle drag leave box
  const handleDragLeave = (e) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Only handle if it's actually leaving the container, not entering a child
      if (e.currentTarget.contains(e.relatedTarget)) {
        return;
      }
    }
    
    setTargetBox(null);
    setConfirmedDrop(false);
    
    // Clear hover timer
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    
    setHoverTime(0);
  };

  // Handle drop
  const handleDrop = (boxId, e) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Clear hover timer if it's still running
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    
    // Only process confirmed drops
    if (confirmedDrop && targetBox === boxId) {
      // Save pending transfer details and show confirmation modal
      const nftItem = nfts.find(n => n.id === draggedNft);
      setPendingTransfer({
        nftId: draggedNft,
        fromAddress: nftItem.owner,
        toAddress: boxId,
        tokenId: nftItem.tokenId
      });
      setShowConfirmModal(true);
    } else {
      // Reset states for unconfirmed drops
      setDraggedNft(null);
      setTargetBox(null);
      setHoverTime(0);
      setConfirmedDrop(false);
    }
  };
  
  // Handle transfer confirmation
  const handleConfirmTransfer = (confirmed) => {
    setShowConfirmModal(false);
    
    if (confirmed && pendingTransfer) {
      executeTransfer(pendingTransfer.nftId, pendingTransfer.toAddress);
    } else {
      // If declined, reset states
      setDraggedNft(null);
      setTargetBox(null);
      setHoverTime(0);
      setTransferState(null);
      setConfirmedDrop(false);
    }
    
    setPendingTransfer(null);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearInterval(hoverTimerRef.current);
      }
    };
  }, []);

  // Determine NFT card class based on its state
  const getNftCardClass = (nft) => {
    const baseClass = "relative rounded-md overflow-hidden shadow-md cursor-move";
    
    if (nft.id === draggedNft) {
      if (transferState === 'pending') return `${baseClass} opacity-50 animate-pulse`;
      if (transferState === 'success') return `${baseClass} animate-ping-once`;
      if (transferState === 'failed') return `${baseClass} animate-shake`;
      return `${baseClass} z-10 shadow-lg scale-105`;
    }
    
    return baseClass;
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 p-4 font-sans text-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center">
        <ZapIcon className="h-6 w-6 mr-2 text-cyan-400" />
        NFT Transfer Demo
      </h1>
      
      {/* Main content area */}
      <div className="flex flex-1 gap-4 mb-4">
        {/* Left column */}
        <div className="flex flex-col w-1/2 gap-4">
          {/* Admin box */}
          <AddressBox 
            title="Admin" 
            address={addresses.admin}
            icon={<Wallet className="h-5 w-5" />}
            isTarget={targetBox === 'admin'}
            hoverProgress={targetBox === 'admin' ? hoverTime : 0}
            confirmedDrop={targetBox === 'admin' && confirmedDrop}
            onDragEnter={(e) => handleDragEnter('admin', e)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop('admin', e)}
            size="small"
            color="from-indigo-500 to-purple-500"
          >
            <div className="flex flex-wrap gap-2">
              {nfts.filter(nft => nft.owner === 'admin').map(nft => (
                <NFTCard 
                  key={nft.id}
                  nft={nft}
                  className={getNftCardClass(nft)}
                  isDragging={nft.id === draggedNft}
                  transferState={nft.id === draggedNft ? transferState : null}
                  onDragStart={(e) => handleDragStart(nft.id, e)}
                />
              ))}
            </div>
          </AddressBox>
          
          {/* Vault box */}
          <AddressBox 
            title="Vault" 
            address={addresses.vault}
            icon={<Archive className="h-5 w-5" />}
            isTarget={targetBox === 'vault'}
            hoverProgress={targetBox === 'vault' ? hoverTime : 0}
            confirmedDrop={targetBox === 'vault' && confirmedDrop}
            onDragEnter={(e) => handleDragEnter('vault', e)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop('vault', e)}
            size="large"
            color="from-cyan-500 to-blue-500"
          >
            <div className="flex flex-wrap gap-2">
              {nfts.filter(nft => nft.owner === 'vault').map(nft => (
                <NFTCard 
                  key={nft.id}
                  nft={nft}
                  className={getNftCardClass(nft)}
                  isDragging={nft.id === draggedNft}
                  transferState={nft.id === draggedNft ? transferState : null}
                  onDragStart={(e) => handleDragStart(nft.id, e)}
                />
              ))}
            </div>
          </AddressBox>
        </div>
        
        {/* Right column */}
        <div className="flex flex-col w-1/2 gap-4">
          {/* User boxes */}
          {[
            {id: 'userA', color: 'from-fuchsia-500 to-pink-500'},
            {id: 'userB', color: 'from-green-400 to-emerald-500'},
            {id: 'userC', color: 'from-orange-400 to-amber-500'},
            {id: 'userD', color: 'from-blue-400 to-violet-500'}
          ].map((user, index) => (
            <AddressBox 
              key={user.id}
              title={`User ${String.fromCharCode(65 + index)}`} 
              address={addresses[user.id]}
              icon={<Wallet className="h-5 w-5" />}
              isTarget={targetBox === user.id}
              hoverProgress={targetBox === user.id ? hoverTime : 0}
              confirmedDrop={targetBox === user.id && confirmedDrop}
              onDragEnter={(e) => handleDragEnter(user.id, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(user.id, e)}
              size="medium"
              color={user.color}
            >
              <div className="flex flex-wrap gap-2">
                {nfts.filter(nft => nft.owner === user.id).map(nft => (
                  <NFTCard 
                    key={nft.id}
                    nft={nft}
                    className={getNftCardClass(nft)}
                    isDragging={nft.id === draggedNft}
                    transferState={nft.id === draggedNft ? transferState : null}
                    onDragStart={(e) => handleDragStart(nft.id, e)}
                  />
                ))}
              </div>
            </AddressBox>
          ))}
        </div>
      </div>
      
      {/* Transaction history panel */}
      <div className="bg-gray-800 rounded-md shadow-md overflow-hidden border border-gray-700">
        <div 
          className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => setHistoryExpanded(!historyExpanded)}
        >
          <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Transaction History</h2>
          <div className={`transform transition-transform ${historyExpanded ? 'rotate-180' : ''} text-cyan-400`}>▲</div>
        </div>
        
        {historyExpanded && (
          <div className="p-3">
            <div className="grid grid-cols-5 font-bold mb-2 text-gray-300 border-b border-gray-700 pb-2">
              <div>From</div>
              <div>To</div>
              <div>Token ID</div>
              <div>Status</div>
              <div>Time</div>
            </div>
            
            {transactions.map(tx => (
              <div key={tx.id} className="grid grid-cols-5 py-2 border-t border-gray-700">
                <div>{tx.from}</div>
                <div>{tx.to}</div>
                <div>{tx.tokenId}</div>
                <div>
                  {tx.status === 'success' ? (
                    <span className="flex items-center text-green-400">
                      <CheckCircle className="h-4 w-4 mr-1" /> Success
                    </span>
                  ) : (
                    <span className="flex items-center text-pink-500">
                      <AlertCircle className="h-4 w-4 mr-1" /> Failed
                    </span>
                  )}
                </div>
                <div>{tx.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && pendingTransfer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 border border-gray-600 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-400">Confirm Transfer</h2>
              <button 
                onClick={() => handleConfirmTransfer(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="mb-4">Are you sure you want to transfer this NFT?</p>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-900 rounded-md">
                <img 
                  src={nfts.find(n => n.id === pendingTransfer.nftId)?.image || ''} 
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
                onClick={() => handleConfirmTransfer(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmTransfer(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-gray-900 font-bold rounded-md transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponents

// Address Box Component
const AddressBox = ({ 
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
  
  const gradientClass = `bg-gradient-to-br ${color} bg-opacity-10`;
  
  // Make the entire container dragover-enabled
  const handleDragOver = (e) => {
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

// NFT Card Component
const NFTCard = ({ nft, className, isDragging, transferState, onDragStart }) => {
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

// Add some global styles for animations
const styles = `
@keyframes ping-once {
  0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7); }
  50% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
  100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
}

@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.7); }
  50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.9); }
  100% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.7); }
}

.animate-ping-once {
  animation: ping-once 0.5s ease-in-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-glow {
  animation: glow 1.5s infinite;
}
`;

// Append styles to the component
const AppWithStyles = () => (
  <>
    <style>{styles}</style>
    <NFTTransferApp />
  </>
);

export default AppWithStyles;