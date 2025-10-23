import { X } from 'lucide-react';
import { Participant } from '../lib/supabase';

interface ResultModalProps {
  participant: Participant;
  secretFriend: Participant;
  secretEnemy: Participant;
  onClose: () => void;
  theme: 'friend' | 'enemy';
}

export default function ResultModal({ participant, secretFriend, secretEnemy, onClose, theme }: ResultModalProps) {
  const accentColor = theme === 'friend' ? 'green' : 'red';
  const bgGradient = theme === 'friend'
    ? 'from-green-500/20 to-black'
    : 'from-red-500/20 to-black';
  const borderColor = theme === 'friend' ? 'border-green-500' : 'border-red-500';

  const displayPerson = theme === 'friend' ? secretFriend : secretEnemy;
  const title = theme === 'friend' ? 'Seu Amigo Secreto é:' : 'Seu Inimigo Secreto é:';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-b ${bgGradient} border-2 ${borderColor} rounded-2xl p-8 max-w-md w-full relative shadow-2xl`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">{participant.name}</h2>

        <h3 className={`text-3xl font-bold text-${accentColor}-500 mb-8 text-center animate-pulse`}>
          {title}
        </h3>

        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-4 border-4 border-${accentColor}-500 shadow-lg">
            {displayPerson.photo_url ? (
              <img
                src={displayPerson.photo_url}
                alt={displayPerson.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                {displayPerson.name.charAt(0)}
              </div>
            )}
          </div>

          <h4 className="text-2xl font-bold text-white text-center mb-2">
            {displayPerson.name}
          </h4>

          <p className={`text-lg font-medium ${displayPerson.gender === 'Masculino' ? 'text-blue-400' : 'text-pink-400'}`}>
            {displayPerson.gender}
          </p>
        </div>

        <button
          onClick={onClose}
          className={`w-full mt-8 bg-${accentColor}-500 hover:bg-${accentColor}-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105`}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
