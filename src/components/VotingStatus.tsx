import React from 'react';
import { useVotingStore } from '../store/useVotingStore';
import { ShieldCheck } from 'lucide-react';

export const VotingStatus: React.FC = () => {
  const blockchain = useVotingStore((state) => state.blockchain);
  const isValid = blockchain.isChainValid();
  const totalVotes = blockchain.getChain().length - 1; // Subtract genesis block

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ShieldCheck className={`w-6 h-6 ${isValid ? 'text-green-500' : 'text-red-500'} mr-2`} />
          <h2 className="text-xl font-semibold">Blockchain Status</h2>
        </div>
        <span className="text-gray-600">Total Votes: {totalVotes}</span>
      </div>
      <div className="mt-4">
        <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {isValid ? 'Blockchain is valid and secure' : 'Warning: Blockchain integrity compromised'}
        </div>
      </div>
    </div>
  );
};