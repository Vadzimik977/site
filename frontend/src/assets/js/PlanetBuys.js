// Connect TonConnect SDK
const tonConnect = new TonConnect();

// Function to connect wallet
async function connectWallet() {
  try {
    await tonConnect.connect();
    const walletAddress = tonConnect.wallet.address;
    // Show wallet details to the user
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
}

// Function to purchase planet
async function purchasePlanet(planetId) {
  try {
    const planet = planetsData.find(p => p.number === planetId);
    const price = planet.price; // Price in TON

    if (!tonConnect.wallet) {
      alert('Please connect your TON wallet first!');
      return;
    }

    const transaction = await tonConnect.sendTransaction({
      to: "SELLER_WALLET_ADDRESS", // Your marketplace wallet address
      amount: price * 1000000000 // Convert to nanoton
    });

    alert(`You have successfully purchased ${planet.name} for ${price} TON!`);
  } catch (error) {
    console.error('Purchase failed:', error);
    alert('Transaction failed. Please try again.');
  }
}
