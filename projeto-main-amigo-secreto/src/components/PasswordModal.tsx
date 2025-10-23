import { useState } from 'react';
import { X } from 'lucide-react';

interface PasswordModalProps {
  participantName: string;
  onSubmit: (password: string) => void;
  onClose: () => void;
  theme: 'friend' | 'enemy';
  error?: string;
}

export default function PasswordModal({ participantName, onSubmit, onClose, theme, error }: PasswordModalProps) {
  const [password, setPassword] = useState('');

  const accentColor = theme === 'friend' ? 'green' : 'red';
  const bgGradient = theme === 'friend'
    ? 'from-green-500/20 to-black'
    : 'from-red-500/20 to-black';
  const buttonBg = theme === 'friend' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  const borderColor = theme === 'friend' ? 'border-green-500' : 'border-red-500';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-b ${bgGradient} border-2 ${borderColor} rounded-2xl p-8 max-w-md w-full relative shadow-2xl`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
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
            placeholder="Sua senha secreta"
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-${accentColor}-500 mb-4"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            className={`w-full ${buttonBg} text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105`}
          >
            Revelar Sorteio
          </button>
        </form>
      </div>
    </div>
  );
}
