import type { Participant } from '../lib/types';

interface ParticipantCardProps {
  participant: Participant;
  onClick: () => void;
  theme: 'friend' | 'enemy';
}

export default function ParticipantCard({ participant, onClick, theme }: ParticipantCardProps) {
  const bgColor = theme === 'friend' ? 'bg-gray-800' : 'bg-gray-900';
  const borderColor = theme === 'friend' ? 'border-green-500' : 'border-red-500';
  const hoverShadow = theme === 'friend' ? 'hover:shadow-green-500/50' : 'hover:shadow-red-500/50';
  const inicial = participant.name?.charAt(0).toUpperCase() ?? '?';
  const displayName = participant.name ?? 'Nome Indisponível';

  return (
    <div
      onClick={onClick}
      className={`${bgColor} ${borderColor} border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${hoverShadow} flex items-center gap-4`}
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 border-2 border-gray-600">
        {participant.photo_url ? (
          <img
            src={participant.photo_url}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
            {inicial}
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg">{displayName}</h3> 
        
        {participant.gender && (
          <p className={`text-sm font-medium ${participant.gender === 'Masculino' ? 'text-blue-400' : 'text-pink-400'}`}>
            {participant.gender}
          </p>
        )}
      </div>
    </div>
  );
}