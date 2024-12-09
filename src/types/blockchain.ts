export interface Block {
  index: number;
  timestamp: number;
  vote: Vote;
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Vote {
  voterId: string;
  candidateId: string;
  timestamp: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  imageUrl: string;
}