import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useVotingStore } from '../store/useVotingStore';
import type { VoterRegistration } from '../types/voter';

export const VoterRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<VoterRegistration>({
    name: '',
    dateOfBirth: '',
    address: '',
  });
  const [registeredId, setRegisteredId] = useState<string>('');
  const registerVoter = useVotingStore((state) => state.registerVoter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const voterId = await registerVoter(formData);
    setRegisteredId(voterId);
    setFormData({ name: '', dateOfBirth: '', address: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <UserPlus className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold">Voter Registration</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Register
        </button>
      </form>

      {registeredId && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 font-medium">Registration Successful!</p>
          <p className="text-green-600">Your Voter ID: {registeredId}</p>
          <p className="text-sm text-green-500 mt-2">
            Please save this ID. You'll need it to cast your vote.
          </p>
        </div>
      )}
    </div>
  );
};