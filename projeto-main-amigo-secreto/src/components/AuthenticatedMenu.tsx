import { X, Gift, Skull, Settings } from 'lucide-react';

interface AuthenticatedMenuProps {
  participantName: string;
  onClose: () => void;
  onRevealFriend: () => void;
  onRevealEnemy: () => void;
  onOpenPreferences: () => void;
}

export default function AuthenticatedMenu({
  participantName,
  onClose,
  onRevealFriend,
  onRevealEnemy,
  onOpenPreferences,
}: AuthenticatedMenuProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-red-500/20 to-black border-2 border-red-500 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-2 text-center">Bem-vindo!</h2>
        <p className="text-gray-300 mb-8 text-center">{participantName}</p>

        <div className="space-y-4">
          <button
            onClick={onRevealFriend}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Gift size={24} />
            AMIGO SECRETO
          </button>

          <button
            onClick={onRevealEnemy}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Skull size={24} />
            INIMIGO SECRETO
          </button>

          <button
            onClick={onOpenPreferences}
            className="w-full flex items-center justify-center gap-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Settings size={24} />
            PREFERÊNCIAS
          </button>
        </div>
      </div>
    </div>
  );
}
