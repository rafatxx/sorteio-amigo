import { useState } from 'react';
import { X } from 'lucide-react';

interface PasswordModalProps {
  participantName: string;
  onSubmit: (password: string) => void;
  onClose: () => void;
  theme: 'friend' | 'enemy';
  error: string;
  isLoading: boolean;
}

export default function PasswordModal({
  participantName,
  onSubmit,
  onClose,
  theme,
  error,
  isLoading,
}: PasswordModalProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(password);
    }
  };

  const borderColor = theme === 'friend' ? 'border-green-500' : 'border-red-500';
  const buttonColor = theme === 'friend' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  const errorColor = theme === 'friend' ? 'text-green-300' : 'text-red-300';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 border-2 ${borderColor} rounded-2xl p-8 max-w-sm w-full relative shadow-2xl`}>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Digite sua senha</h2>
        <p className="text-gray-300 mb-6">{participantName}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
            autoFocus
          />

          {error && (
            <p className={`text-sm mt-2 text-center ${errorColor}`}>{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className={`${buttonColor} w-full mt-6 py-3 rounded-lg text-lg text-white font-bold transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Verificando...' : 'Revelar Sorteio'}
          </button>
        </form>
      </div>
    </div>
  );
}