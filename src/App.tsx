import React, { useEffect, useState } from 'react';
import { VoteCard } from './components/VoteCard';
import { VotingStatus } from './components/VotingStatus';
import { VoterRegistrationForm } from './components/VoterRegistration';
import { useVotingStore } from './store/useVotingStore';
import { Vote } from 'lucide-react';

function App() {
  const [voterId, setVoterId] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const { candidates, castVote, hasVoted, error, verifyVoter, initialize, currentVoter } = useVotingStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleVote = async (candidateId: string) => {
    if (!voterId.trim()) {
      alert('Please enter your Voter ID');
      return;
    }
    await castVote(voterId, candidateId);
  };

  const handleVerifyVoter = async () => {
    if (!voterId.trim()) {
      alert('Please enter your Voter ID');
      return;
    }
    await verifyVoter(voterId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Vote className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Blockchain Voting System</h1>
        </div>

        {showRegistration ? (
          <div className="max-w-2xl mx-auto mb-8">
            <VoterRegistrationForm />
            <button
              onClick={() => setShowRegistration(false)}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              ← Back to voting
            </button>
          </div>
        ) : !hasVoted ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center max-w-md">
                <div className="flex-1 mr-4">
                  <label htmlFor="voterId" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your Voter ID
                  </label>
                  <input
                    type="text"
                    id="voterId"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your Voter ID"
                  />
                </div>
                <button
                  onClick={handleVerifyVoter}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-6"
                >
                  Verify ID
                </button>
              </div>
              {error && (
                <p className="text-red-500 mt-2">{error}</p>
              )}
              <button
                onClick={() => setShowRegistration(true)}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Don't have a Voter ID? Register here
              </button>
            </div>

            {currentVoter && (
              <>
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">Welcome, {currentVoter.name}!</p>
                  <p className="text-green-600 text-sm">You can now cast your vote.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {candidates.map((candidate) => (
                    <VoteCard
                      key={candidate.id}
                      candidate={candidate}
                      onVote={() => handleVote(candidate.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Thank you for voting!</h2>
            <p className="text-green-600">Your vote has been securely recorded on the blockchain.</p>
          </div>
        )}

        <div className="mt-8">
          <VotingStatus />
        </div>
      </div>
    </div>
  );
}

export default App;