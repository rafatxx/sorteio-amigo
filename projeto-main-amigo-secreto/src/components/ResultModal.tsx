import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Participant } from '../lib/types';
import { getParticipantDetails } from '../lib/api';

interface ResultModalProps {
  participant: Participant;
  secretFriend: Participant;
  secretEnemy: Participant;
  onClose: () => void;
  theme: 'friend' | 'enemy';
}

export default function ResultModal({
  secretFriend,
  secretEnemy,
  onClose,
  theme,
}: ResultModalProps) {
  
  const personToShow = theme === 'friend' ? secretFriend : secretEnemy;
  const title = theme === 'friend' ? 'Seu Amigo Secreto é:' : 'Seu Inimigo Secreto é:';
  
  const bgColor = theme === 'friend' ? 'bg-gradient-to-b from-green-500/20 to-black' : 'bg-gradient-to-b from-red-500/20 to-black';
  const borderColor = theme === 'friend' ? 'border-green-500' : 'border-red-500';
  const buttonColor = theme === 'friend' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';

  const displayName = personToShow.name ?? 'Nome Indisponível';
  const inicial = personToShow.name?.charAt(0).toUpperCase() ?? '?';

  const [gostosAtualizados, setGostosAtualizados] = useState(secretFriend.gostos_pessoais);
  const [loadingGostos, setLoadingGostos] = useState(false);

  useEffect(() => {
    if (theme === 'friend') {
      const fetchLatestPreferences = async () => {
        setLoadingGostos(true);
        try {
          const amigoAtualizado = await getParticipantDetails(secretFriend.id.toString());
          setGostosAtualizados(amigoAtualizado.gostos_pessoais);
        } catch (error) {
          console.error("Erro ao buscar gostos atualizados:", error);
        }
        setLoadingGostos(false);
      };

      fetchLatestPreferences();
    }
  }, [secretFriend.id, theme]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} ${borderColor} border-2 rounded-2xl p-8 max-w-md w-full relative shadow-2xl text-center`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-300 mb-6">{title}</h2>

        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mx-auto border-4 border-gray-600 mb-4">
          {personToShow.photo_url ? (
            <img
              src={personToShow.photo_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
              {inicial}
            </div>
          )}
        </div>
        
        <h3 className="text-white font-bold text-3xl mb-1">{displayName}</h3>
        {personToShow.gender && (
          <p className={`text-lg font-medium ${personToShow.gender === 'Masculino' ? 'text-blue-400' : 'text-pink-400'}`}>
            {personToShow.gender}
          </p>
        )}
        
        {theme === 'friend' && (
          <div className="mt-6 pt-6 border-t border-gray-700 text-left">
            <h4 className="text-lg font-semibold text-white mb-2">
              Preferências de {secretFriend.name.split(' ')[0]}:
            </h4>
            
            <p className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded-lg max-h-24 overflow-y-auto">
              {loadingGostos
                ? 'Carregando preferências...'
                : (gostosAtualizados && gostosAtualizados.replace(/,/g, ', ')) || 'Nenhuma preferência adicionada ainda.'}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className={`${buttonColor} w-full mt-8 py-3 rounded-lg text-lg text-white font-bold transition-all duration-300 transform hover:scale-105`}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}