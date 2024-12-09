import React from 'react';
import { Vote, ChevronRight } from 'lucide-react';
import { Candidate } from '../types/blockchain';
import { useVotingStore } from '../store/useVotingStore';

interface VoteCardProps {
  candidate: Candidate;
  onVote: () => void;
}

export const VoteCard: React.FC<VoteCardProps> = ({ candidate, onVote }) => {
  const getCandidateVotes = useVotingStore((state) => state.getCandidateVotes);
  const votes = getCandidateVotes(candidate.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={candidate.imageUrl}
          alt={candidate.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{candidate.name}</h3>
          <p className="text-gray-600">{candidate.party}</p>
          <div className="flex items-center mt-2 text-gray-500">
            <Vote className="w-4 h-4 mr-1" />
            <span>{votes} votes</span>
          </div>
        </div>
        <button
          onClick={onVote}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          Vote
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};