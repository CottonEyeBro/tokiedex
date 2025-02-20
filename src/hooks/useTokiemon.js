import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { base } from 'wagmi/chains';
import { TOKIEMON_ABI } from '../abi'; // Import the hardcoded ABI
import { useEffect, useState } from 'react';

export const TOKIEMON_ADDRESS = '0x802187c392b15CDC8df8Aa05bFeF314Df1f65C62';

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export function useTokiemon() {
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]); // State to store NFT data with images
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isFetched, setIsFetched] = useState(false); // State to track if data has been fetched

  // Step 1: Get total NFT count
  const { data: balanceOfData } = useReadContract({
    address: TOKIEMON_ADDRESS,
    abi: TOKIEMON_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  const totalNFTs = balanceOfData ? Number(balanceOfData) : 0;

  // Step 2: Get token IDs
  const tokenQueries =
    address && totalNFTs > 0
      ? Array.from({ length: totalNFTs }, (_, i) => ({
          address: TOKIEMON_ADDRESS,
          abi: TOKIEMON_ABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, i],
        }))
      : [];

  const { data: tokenIdsData } = useReadContracts({
    contracts: tokenQueries,
    enabled: !!address && totalNFTs > 0,
  });

  const tokenIds = tokenIdsData ? tokenIdsData.map((obj) => obj.result?.toString() || '') : [];

  // Step 3: Fetch tokenURI for each token
  const tokenURIQueries =
    tokenIds.length > 0
      ? tokenIds.map((tokenId) => ({
          address: TOKIEMON_ADDRESS,
          abi: TOKIEMON_ABI,
          functionName: 'tokenURI',
          args: [tokenId],
        }))
      : [];

  const { data: tokenURIData } = useReadContracts({
    contracts: tokenURIQueries,
    enabled: tokenIds.length > 0,
  });

  // Step 4: Fetch metadata from tokenURI
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!isFetched && tokenURIData && tokenIds.length > 0) {
        setIsLoading(true);

        try {
          const nftData = await Promise.all(
            tokenURIData.map(async (uriData, index) => {
              const tokenId = tokenIds[index];
              const uri = uriData.result;

              if (uri) {
                try {
                  const response = await fetch(uri);
                  const metadata = await response.json();

                  let community = '';
                  let rarity = '';
                  let tier = '';

                  if (metadata.attributes) {
                    metadata.attributes.forEach((attribute) => {
                      switch (attribute.trait_type) {
                        case 'Community':
                          community = attribute.value;
                          break;
                        case 'Rarity':
                          rarity = attribute.value;
                          break;
                        case 'Purchase Tier':
                          tier = attribute.value;
                          break;
                        default:
                          break;
                      }
                    });
                  }

                  return {
                    id: tokenId,
                    community,
                    name: metadata.name || '',
                    tier,
                    rarity,
                    image: metadata.image || '',
                  };
                } catch (error) {
                  console.error(`Error fetching metadata for token ${tokenId}:`, error);
                  return {
                    id: tokenId,
                    community: '',
                    name: '',
                    tier: '',
                    rarity: '',
                    image: '',
                  };
                }
              }
              return {
                id: tokenId,
                community: '',
                name: '',
                tier: '',
                rarity: '',
                image: '',
              };
            })
          );

          // Set the fetched NFT data
          setNfts(nftData);
          setIsFetched(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMetadata();
  }, [tokenURIData, tokenIds, isFetched]);

  return { totalNFTs, nfts, isLoading };
}


//  // Provides mock Tokiemon for testing purposes

// import { useReadContract, useReadContracts, useAccount } from 'wagmi';
// import { createPublicClient, http } from 'viem';
// import { base } from 'wagmi/chains';
// import { TOKIEMON_ABI } from '../abi'; // Import the hardcoded ABI
// import { useEffect, useState } from 'react';

// export const TOKIEMON_ADDRESS = '0x802187c392b15CDC8df8Aa05bFeF314Df1f65C62';

// export const publicClient = createPublicClient({
//   chain: base,
//   transport: http(),
// });

// export function useTokiemon() {
//   const { address } = useAccount();
//   const [nfts, setNfts] = useState([]); // State to store NFT data with images
//   const [isLoading, setIsLoading] = useState(true); // Loading state
//   const [isFetched, setIsFetched] = useState(false); // State to track if data has been fetched

//   // Mock Tokiemon data for testing
//   const mockTokiemon = [
//     {
//       id: '65700',
//       community: 'TOKIEMON',
//       name: 'Telewurl',
//       tier: 'Kawaii',
//       rarity: 'Uncommon',
//       image: 'https://imagedelivery.net/jl4KsGg6uKeITWxpmTggpQ/d55cabea-27b1-4c50-7bdd-8a95d4193900/full', // Placeholder image
//     },
//     {
//       id: '55760',
//       community: 'ETH',
//       name: 'Draghost',
//       tier: 'Dragon',
//       rarity: 'Rare',
//       image: 'https://imagedelivery.net/jl4KsGg6uKeITWxpmTggpQ/8543e74c-da0d-40eb-898f-f225e5fbc900/full', // Placeholder image
//     },
//     {
//       id: '55876',
//       community: 'BASED',
//       name: 'Silast',
//       tier: 'Dragon',
//       rarity: 'Legendary',
//       image: 'https://imagedelivery.net/jl4KsGg6uKeITWxpmTggpQ/a746cd26-1f8f-46a3-8d6b-5fff10011800/full', // Placeholder image
//     },
//   ];

//   // Step 1: Get total NFT count
//   const { data: balanceOfData } = useReadContract({
//     address: TOKIEMON_ADDRESS,
//     abi: TOKIEMON_ABI,
//     functionName: 'balanceOf',
//     args: [address],
//     enabled: !!address,
//   });

//   const totalNFTs = balanceOfData ? Number(balanceOfData) : 0;

//   // Step 2: Get token IDs
//   const tokenQueries =
//     address && totalNFTs > 0
//       ? Array.from({ length: totalNFTs }, (_, i) => ({
//           address: TOKIEMON_ADDRESS,
//           abi: TOKIEMON_ABI,
//           functionName: 'tokenOfOwnerByIndex',
//           args: [address, i],
//         }))
//       : [];

//   const { data: tokenIdsData } = useReadContracts({
//     contracts: tokenQueries,
//     enabled: !!address && totalNFTs > 0,
//   });

//   const tokenIds = tokenIdsData ? tokenIdsData.map((obj) => obj.result?.toString() || '') : [];

//   // Step 3: Fetch tokenURI for each token
//   const tokenURIQueries =
//     tokenIds.length > 0
//       ? tokenIds.map((tokenId) => ({
//           address: TOKIEMON_ADDRESS,
//           abi: TOKIEMON_ABI,
//           functionName: 'tokenURI',
//           args: [tokenId],
//         }))
//       : [];

//   const { data: tokenURIData } = useReadContracts({
//     contracts: tokenURIQueries,
//     enabled: tokenIds.length > 0,
//   });

//   // Step 4: Fetch metadata from tokenURI
//   useEffect(() => {
//     const fetchMetadata = async () => {
//       if (!isFetched && tokenURIData && tokenIds.length > 0) {
//         setIsLoading(true);

//         try {
//           const nftData = await Promise.all(
//             tokenURIData.map(async (uriData, index) => {
//               const tokenId = tokenIds[index];
//               const uri = uriData.result;

//               if (uri) {
//                 try {
//                   const response = await fetch(uri);
//                   const metadata = await response.json();

//                   let community = '';
//                   let rarity = '';
//                   let tier = '';

//                   if (metadata.attributes) {
//                     metadata.attributes.forEach((attribute) => {
//                       switch (attribute.trait_type) {
//                         case 'Community':
//                           community = attribute.value;
//                           break;
//                         case 'Rarity':
//                           rarity = attribute.value;
//                           break;
//                         case 'Purchase Tier':
//                           tier = attribute.value;
//                           break;
//                         default:
//                           break;
//                       }
//                     });
//                   }

//                   return {
//                     id: tokenId,
//                     community,
//                     name: metadata.name || '',
//                     tier,
//                     rarity,
//                     image: metadata.image || '',
//                   };
//                 } catch (error) {
//                   console.error(`Error fetching metadata for token ${tokenId}:`, error);
//                   return {
//                     id: tokenId,
//                     community: '',
//                     name: '',
//                     tier: '',
//                     rarity: '',
//                     image: '',
//                   };
//                 }
//               }
//               return {
//                 id: tokenId,
//                 community: '',
//                 name: '',
//                 tier: '',
//                 rarity: '',
//                 image: '',
//               };
//             })
//           );

//           // Add mock Tokiemon data for testing
//           const combinedNfts = [...nftData, ...mockTokiemon];
//           setNfts(combinedNfts);
//           setIsFetched(true);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchMetadata();
//   }, [tokenURIData, tokenIds, isFetched]);

//   return { totalNFTs: totalNFTs + mockTokiemon.length, nfts, isLoading };
// }