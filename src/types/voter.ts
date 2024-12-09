export interface Voter {
  id: string;
  name: string;
  dateOfBirth: string;
  address: string;
  registrationDate: number;
  hasVoted: boolean;
}

export interface VoterRegistration {
  name: string;
  dateOfBirth: string;
  address: string;
}