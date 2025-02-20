import React, { useState } from 'react';
import { useTokiemon } from './hooks/useTokiemon';
import { useAccount } from 'wagmi';
import WalletConnector from './components/WalletConnector';
import TokiemonCard from './components/TokiemonCard'; // Import the new component

export default function App() {
  const { isConnected } = useAccount(); // Get wallet connection status
  const { totalNFTs, nfts } = useTokiemon(); // Fetch Tokiemon data

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order state

  // Step 1: Filter and sort Tokiemon based on user input
  const filteredTokiemon = nfts
    .filter((tokiemon) =>
      tokiemon.id.includes(searchQuery) ||
      tokiemon.community.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (sortOrder === 'asc' ? a.id - b.id : b.id - a.id));

  // console.log('Filtered Tokiemon:', filteredTokiemon);

  return (
    <div>
      <h1>Welcome to your Tokiedex</h1>

      {isConnected ? (
        <div>
          <WalletConnector />
          <h2>Your Collection</h2>

          {/* Search Bar */}
          <input
            type="text"
            className="search-bar"
            placeholder="Search by ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Sort Toggle */}
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            Sort by ID: {sortOrder === 'asc' ? 'Low-High' : 'High-Low'}
          </button>
          <br></br>

          {/* Tokiemon List */}
          <span>Total Tokiemon: {totalNFTs}</span>
          <div className="tokiemon-list">
            {filteredTokiemon.map((tokiemon) => (
              <TokiemonCard key={tokiemon.id} tokiemon={tokiemon} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <WalletConnector />
          <p>Please connect your wallet to view your Tokiemon collection.</p>
        </div>
      )}
    </div>
  );
}