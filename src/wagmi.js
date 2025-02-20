import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base], // Add the chains you want to support
  connectors: [coinbaseWallet()],
  transports: {
    [base.id]: http(),
  },
});