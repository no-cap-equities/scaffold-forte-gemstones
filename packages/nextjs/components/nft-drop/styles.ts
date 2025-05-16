// Styles for NFT drop animations
export const nftDropStyles = `
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