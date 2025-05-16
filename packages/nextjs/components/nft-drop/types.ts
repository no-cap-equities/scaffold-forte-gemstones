// Types for NFT drop components
export interface Address {
  admin: string;
  vault: string;
  userA: string;
  userB: string;
  userC: string;
  userD: string;
}

export interface NFT {
  id: number;
  tokenId: string;
  image: string;
  owner: string;
  color: string;
}

export interface Transaction {
  id: number;
  from: string;
  to: string;
  tokenId: string;
  status: 'success' | 'failed';
  timestamp: string;
}

export interface PendingTransfer {
  nftId: number;
  fromAddress: string;
  toAddress: string;
  tokenId: string;
}

export type TransferState = null | 'pending' | 'success' | 'failed';