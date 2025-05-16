import React, { useEffect, useState } from "react";

interface AddAnvilChainButtonProps {
  className?: string;
}

export const AddAnvilChainButton = ({ className = "" }: AddAnvilChainButtonProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addAnvilToMetaMask = async () => {
    // Check if window.ethereum is available (MetaMask is installed)
    if (!window.ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }
    
    try {
      // Request to add the Anvil chain to MetaMask
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7A69", // 31337 in hexadecimal
            chainName: "Anvil Local",
            nativeCurrency: {
              name: "Ethereum",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["http://127.0.0.1:8545/"],
            blockExplorerUrls: [], // No block explorer for local chains
          },
        ],
      });
      
      console.log("Anvil chain added to MetaMask successfully");
    } catch (error) {
      console.error("Error adding Anvil chain to MetaMask:", error);
    }
  };

  // Only render the button on the client side to prevent hydration issues
  if (!isClient) return null;

  return (
    <button 
      className={`btn btn-primary ${className}`} 
      onClick={addAnvilToMetaMask}
    >
      Add Anvil to MetaMask
    </button>
  );
}; 