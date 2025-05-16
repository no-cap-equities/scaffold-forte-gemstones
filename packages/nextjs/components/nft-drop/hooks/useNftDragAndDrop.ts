import { useState, useRef, useEffect } from 'react';
import { NFT, Transaction, TransferState, PendingTransfer } from '../types';
import { INITIAL_NFTS, INITIAL_TRANSACTIONS, HOVER_TIMER_INTERVAL, HOVER_TIMER_INCREMENT, CONFIRMATION_DELAY, RESET_DELAY } from '../constants';

export const useNftDragAndDrop = () => {
  // NFT data with current owners
  const [nfts, setNfts] = useState<NFT[]>(INITIAL_NFTS);

  // Transaction history
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // UI state management
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [draggedNft, setDraggedNft] = useState<number | null>(null);
  const [targetBox, setTargetBox] = useState<string | null>(null);
  const [hoverTime, setHoverTime] = useState(0);
  const [transferState, setTransferState] = useState<TransferState>(null);
  const [confirmedDrop, setConfirmedDrop] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<PendingTransfer | null>(null);
  
  // Timer references
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const originalPositionRef = useRef<string | null>(null);

  // Simulated transfer function
  const executeTransfer = (nftId: number, toAddress: string) => {
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
        if (targetNft) {
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
        }
      } else {
        setTransferState('failed');
        // Add failed transaction to history
        const targetNft = nfts.find(n => n.id === nftId);
        if (targetNft) {
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
      }
      
      // Reset states after animation completes
      setTimeout(() => {
        setDraggedNft(null);
        setTargetBox(null);
        setHoverTime(0);
        setTransferState(null);
        setConfirmedDrop(false);
      }, RESET_DELAY);
    }, CONFIRMATION_DELAY);
  };

  // Handle drag start
  const handleDragStart = (nftId: number) => {
    setDraggedNft(nftId);
    const nft = nfts.find(n => n.id === nftId);
    if (nft) {
      originalPositionRef.current = nft.owner;
    }
    
    // Clear any existing hover timer
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // Handle drag enter box
  const handleDragEnter = (boxId: string, e: React.DragEvent<HTMLDivElement>) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
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
    
    // Update timer
    hoverTimerRef.current = setInterval(() => {
      setHoverTime(prev => {
        // If we've reached 100%, stop the timer and confirm drop
        if (prev >= 100) {
          if (hoverTimerRef.current) {
            clearInterval(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
          setConfirmedDrop(true);
          return 100;
        }
        // Otherwise, increment
        return prev + HOVER_TIMER_INCREMENT;
      });
    }, HOVER_TIMER_INTERVAL);
  };

  // Handle drag leave box
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle if it's actually leaving the container, not entering a child
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
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
  const handleDrop = (boxId: string, e: React.DragEvent<HTMLDivElement>) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Clear hover timer if it's still running
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    
    // Only process confirmed drops
    if (confirmedDrop && targetBox === boxId && draggedNft !== null) {
      // Save pending transfer details and show confirmation modal
      const nftItem = nfts.find(n => n.id === draggedNft);
      if (nftItem) {
        setPendingTransfer({
          nftId: draggedNft,
          fromAddress: nftItem.owner,
          toAddress: boxId,
          tokenId: nftItem.tokenId
        });
        setShowConfirmModal(true);
      }
    } else {
      // Reset states for unconfirmed drops
      setDraggedNft(null);
      setTargetBox(null);
      setHoverTime(0);
      setConfirmedDrop(false);
    }
  };
  
  // Handle transfer confirmation
  const handleConfirmTransfer = (confirmed: boolean) => {
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
  const getNftCardClass = (nft: NFT) => {
    const baseClass = "relative rounded-md overflow-hidden shadow-md cursor-move";
    
    if (nft.id === draggedNft) {
      if (transferState === 'pending') return `${baseClass} opacity-50 animate-pulse`;
      if (transferState === 'success') return `${baseClass} animate-ping-once`;
      if (transferState === 'failed') return `${baseClass} animate-shake`;
      return `${baseClass} z-10 shadow-lg scale-105`;
    }
    
    return baseClass;
  };

  return {
    nfts,
    transactions,
    historyExpanded,
    draggedNft,
    targetBox,
    hoverTime,
    transferState,
    confirmedDrop,
    showConfirmModal,
    pendingTransfer,
    setHistoryExpanded,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleConfirmTransfer,
    getNftCardClass
  };
};