import { create } from 'zustand';
import { Blockchain } from '../utils/blockchain';
import { Candidate, Vote } from '../types/blockchain';
import { Voter, VoterRegistration } from '../types/voter';
import { saveBlockchain, loadBlockchain, saveVoter, getVoter, updateVoterStatus } from '../utils/storage';

interface VotingStore {
  blockchain: Blockchain;
  candidates: Candidate[];
  hasVoted: boolean;
  currentVoter: Voter | null;
  error: string | null;
  castVote: (voterId: string, candidateId: string) => Promise<boolean>;
  getCandidateVotes: (candidateId: string) => number;
  registerVoter: (registration: VoterRegistration) => Promise<string>;
  verifyVoter: (voterId: string) => Promise<boolean>;
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useVotingStore = create<VotingStore>((set, get) => ({
  blockchain: new Blockchain(),
  hasVoted: false,
  currentVoter: null,
  error: null,
  candidates: [
    {
      id: '1',
      name: 'Raj Armand',
      party: 'Progressive Party',
      imageUrl: 'https://res.cloudinary.com/dwmdxgd2z/image/upload/v1733754960/Raj_Armand_satm82.png',
    },
    {
      id: '2',
      name: 'Howard James',
      party: 'Conservative Party',
      imageUrl: 'https://res.cloudinary.com/dwmdxgd2z/image/upload/v1733754960/Howard_James_xep12u.jpg',
    },
    {
      id: '3',
      name: 'Martin Arhcer',
      party: 'Liberty Party',
      imageUrl: 'https://res.cloudinary.com/dwmdxgd2z/image/upload/v1733487319/john.doe_hreyrs.jpg',
    },
  ],

  initialize: async () => {
    const blocks = await loadBlockchain();
    if (blocks.length > 0) {
      const blockchain = new Blockchain();
      blockchain.loadChain(blocks);
      set({ blockchain });
    }
  },

  castVote: async (voterId: string, candidateId: string) => {
    const voter = await getVoter(voterId);
    if (!voter) {
      set({ error: 'Voter ID not found. Please register first.' });
      return false;
    }
    if (voter.hasVoted) {
      set({ error: 'You have already voted.' });
      return false;
    }

    const vote: Vote = {
      voterId,
      candidateId,
      timestamp: Date.now(),
    };

    const { blockchain } = get();
    const block = blockchain.createBlock(vote);
    await saveBlockchain(blockchain.getChain());
    await updateVoterStatus(voterId, true);
    
    set({ hasVoted: true, currentVoter: { ...voter, hasVoted: true }, error: null });
    return true;
  },

  getCandidateVotes: (candidateId: string) => {
    const { blockchain } = get();
    return blockchain
      .getChain()
      .filter((block) => block.vote.candidateId === candidateId).length;
  },

  registerVoter: async (registration: VoterRegistration) => {
    const voterId = `VID${Date.now().toString(36).toUpperCase()}`;
    const voter: Voter = {
      ...registration,
      id: voterId,
      registrationDate: Date.now(),
      hasVoted: false,
    };
    await saveVoter(voter);
    return voterId;
  },

  verifyVoter: async (voterId: string) => {
    const voter = await getVoter(voterId);
    if (!voter) {
      set({ error: 'Voter ID not found. Please register first.' });
      return false;
    }
    if (voter.hasVoted) {
      set({ error: 'You have already voted.' });
      return false;
    }
    set({ currentVoter: voter, error: null });
    return true;
  },

  setError: (error: string | null) => set({ error }),
}));