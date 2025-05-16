import React from 'react';
import { ZapIcon, Wallet, Archive } from 'lucide-react';
import { AddressBox } from './AddressBox';
import { NFTCard } from './NFTCard';
import { TransactionHistory } from './TransactionHistory';
import { ConfirmationModal } from './ConfirmationModal';
import { useNftDragAndDrop } from './hooks/useNftDragAndDrop';
import { SAMPLE_ADDRESSES, USER_COLORS } from './constants';
import { nftDropStyles } from './styles';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NftDragAndDrop: React.FC = () => {
  const {
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
    getNftCardClass,
    isConnected,
    address,
    isSending,
    isConfirming
  } = useNftDragAndDrop();

  return (
    <>
      <style>{nftDropStyles}</style>
      <div className="flex flex-col w-full flex-1 overflow-hidden bg-gray-900 font-sans text-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center">
            <ZapIcon className="h-6 w-6 mr-2 text-cyan-400" />
            NFT Drop Send
          </h1>
          <ConnectButton />
        </div>
        
        {/* Wallet connection status */}
        {!isConnected && (
          <div className="px-4 py-2 text-yellow-400 text-sm">
            Connect your wallet to enable ETH transfers on NFT drop
          </div>
        )}
        
        {/* Transaction status */}
        {(isSending || isConfirming) && (
          <div className="px-4 py-2 text-cyan-400 text-sm">
            {isSending ? 'Sending transaction...' : 'Confirming transaction...'}
          </div>
        )}
        
        {/* Main content area */}
        <div className="flex flex-1 gap-4 px-4 overflow-hidden">
          {/* Left column */}
          <div className="flex flex-col w-1/2 gap-4 overflow-auto">
            {/* Admin box */}
            <AddressBox 
              title="Admin" 
              address={SAMPLE_ADDRESSES.admin}
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
                    onDragStart={(e) => handleDragStart(nft.id)}
                  />
                ))}
              </div>
            </AddressBox>
            
            {/* Vault box */}
            <AddressBox 
              title="Vault" 
              address={SAMPLE_ADDRESSES.vault}
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
                    onDragStart={(e) => handleDragStart(nft.id)}
                  />
                ))}
              </div>
            </AddressBox>
          </div>
          
          {/* Right column */}
          <div className="flex flex-col w-1/2 gap-4 overflow-auto">
            {/* User boxes */}
            {USER_COLORS.map((user, index) => (
              <AddressBox 
                key={user.id}
                title={`User ${String.fromCharCode(65 + index)}`} 
                address={SAMPLE_ADDRESSES[user.id as keyof typeof SAMPLE_ADDRESSES]}
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
                      onDragStart={(e) => handleDragStart(nft.id)}
                    />
                  ))}
                </div>
              </AddressBox>
            ))}
          </div>
        </div>
        
        {/* Transaction history panel - with minimized height */}
        <div className="px-4 pb-3">
          <TransactionHistory 
            transactions={transactions}
            historyExpanded={historyExpanded}
            onToggleExpand={() => setHistoryExpanded(!historyExpanded)}
          />
        </div>
        
        {/* Confirmation Modal */}
        <ConfirmationModal 
          show={showConfirmModal}
          pendingTransfer={pendingTransfer}
          nfts={nfts}
          onConfirm={handleConfirmTransfer}
        />
      </div>
    </>
  );
};

export default NftDragAndDrop;