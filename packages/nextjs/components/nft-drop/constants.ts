// Constants for NFT drop components
export const SAMPLE_ADDRESSES = {
  admin: '0x1234...5678',
  vault: '0xabcd...ef01',
  userA: '0x2345...6789',
  userB: '0x3456...789a',
  userC: '0x4567...89ab',
  userD: '0x5678...9abc',
};

export const INITIAL_NFTS = [
  { id: 1, tokenId: '#1234', image: 'https://static.gemtrust.xyz/images/emerald1.webp', owner: 'admin', color: 'from-pink-500 to-purple-500' },
  { id: 2, tokenId: '#2345', image: 'https://static.gemtrust.xyz/images/tanzanite1.webp', owner: 'admin', color: 'from-cyan-400 to-blue-500' },
  { id: 3, tokenId: '#3456', image: 'https://static.gemtrust.xyz/images/sapphire1.webp', owner: 'vault', color: 'from-green-400 to-emerald-500' },
  { id: 4, tokenId: '#4567', image: 'https://static.gemtrust.xyz/images/ruby1.webp', owner: 'vault', color: 'from-yellow-400 to-orange-500' },
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, from: 'admin', to: 'userA', tokenId: '#6789', status: 'success' as const, timestamp: '2 hours ago' },
  { id: 2, from: 'vault', to: 'userB', tokenId: '#7890', status: 'success' as const, timestamp: '1 hour ago' },
  { id: 3, from: 'vault', to: 'userC', tokenId: '#8901', status: 'failed' as const, timestamp: '30 minutes ago' },
];

export const USER_COLORS = [
  {id: 'userA', color: 'from-fuchsia-500 to-pink-500'},
  {id: 'userB', color: 'from-green-400 to-emerald-500'},
  {id: 'userC', color: 'from-orange-400 to-amber-500'},
  {id: 'userD', color: 'from-blue-400 to-violet-500'}
];

export const HOVER_TIMER_INTERVAL = 33.33; // ~30 fps
export const HOVER_TIMER_INCREMENT = 100 / 90; // Complete in 90 frames
export const CONFIRMATION_DELAY = 2000; // 2 seconds for transfer simulation
export const RESET_DELAY = 1000; // 1 second after transfer