import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Participant } from '../lib/types';
import { getParticipantDetails } from '../lib/api';

interface ResultModalProps {
  participant: Participant;
  secretFriend: Participant;
  secretEnemy: Participant | null;
  onClose: () => void;
  theme: 'friend' | 'enemy';
}

const getGenderColor = (gender: Participant['gender'] | undefined) => {
  if (gender === 'Masculino') return 'text-blue-400';
  if (gender === 'Feminino') return 'text-pink-400';
  if (gender === 'Não Binário') return 'text-purple-400';
  return 'text-gray-400';
};

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
  const [gostosAtualizados, setGostosAtualizados] = useState(secretFriend?.gostos_pessoais);
  const [loadingGostos, setLoadingGostos] = useState(false);

  useEffect(() => {
    if (theme === 'friend' && secretFriend) { 
      setLoadingGostos(true);
      getParticipantDetails(secretFriend.id.toString())
        .then(amigoAtualizado => {
          setGostosAtualizados(amigoAtualizado.gostos_pessoais);
        })
        .catch(error => {
          console.error("Erro ao buscar gostos atualizados:", error);
        })
        .finally(() => {
          setLoadingGostos(false);
        });
    }
  }, [secretFriend?.id, theme]); 


  if (theme === 'enemy' && !secretEnemy) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-red-500/20 to-black border-2 border-red-500 rounded-2xl p-8 max-w-md w-full relative shadow-2xl text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">Ih, arregou?</h2>
          
          <div className="text-gray-300 text-lg space-y-4">
            <p>Parece que você escolheu não participar do Inimigo Secreto este ano!</p>
            <p>Ficou com medinho, é? 😂😂😂😂</p>
            <p className="text-sm text-gray-400">(Ano que vem você participa!)</p>
          </div>
          
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 w-full mt-8 py-3 rounded-lg text-lg text-white font-bold transition-all duration-300 transform hover:scale-105"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (!personToShow) {
     return (
       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
         <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-8 text-center">
           <p className="text-white text-lg">Ocorreu um erro ao carregar os dados do sorteio.</p>
           <button onClick={onClose} className="bg-gray-500 mt-4 px-4 py-2 rounded">Fechar</button>
         </div>
       </div>
    );
  }

  const displayName = personToShow.name ?? 'Nome Indisponível';
  const inicial = personToShow.name?.charAt(0).toUpperCase() ?? '?';
  const genderColor = getGenderColor(personToShow.gender);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} ${borderColor} border-2 rounded-2xl p-8 max-w-md w-full relative shadow-2xl text-center`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
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
          <p className={`text-lg font-medium ${genderColor}`}>
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