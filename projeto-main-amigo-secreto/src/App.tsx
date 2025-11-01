import { useState, useEffect } from 'react';
import { Users, Home } from 'lucide-react';
//import { supabase, Participant, Assignment } from './lib/supabase';
import { getParticipants, getAssignments, login } from './lib/api';
import type { Participant, Resultado } from './lib/types'; 
import ParticipantCard from './components/ParticipantCard';
import PasswordModal from './components/PasswordModal';
import AuthenticatedMenu from './components/AuthenticatedMenu';
import ResultModal from './components/ResultModal';
import PreferencesModal from './components/PreferencesModal';
import Snowfall from './components/Snowfall';

type View = 'home' | 'userlist';
type RevealType = 'friend' | 'enemy' | null;

function App() {
  const [view, setView] = useState<View>('home');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignments, setAssignments] = useState<Resultado[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [secretFriend, setSecretFriend] = useState<Participant | null>(null);
  const [secretEnemy, setSecretEnemy] = useState<Participant | null>(null);
  const [revealType, setRevealType] = useState<RevealType>(null);

  useEffect(() => {
    loadParticipants();
    //loadAssignments();
  }, []);

  const loadParticipants = async () => {
    try {
      const data = await getParticipants();
      setParticipants(data);
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
    }
  };

  const loadAssignments = async (): Promise<Resultado[]> => {
    try {
      const data = await getAssignments();
      setAssignments(data);
      return data;
    } catch (error) {
      console.error("Erro ao carregar sorteio:", error);
      return [];
    }
  };

  const handleParticipantClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowPasswordModal(true);
    setPasswordError('');
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!selectedParticipant) return;

    try {
      const response = await login(selectedParticipant.username, password);
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      console.log("Login bem-sucedido! Token:", access);

      const assignmentsData = await loadAssignments(); 
      if (assignmentsData.length === 0) {
           setPasswordError('Sorteio não encontrado (dados vazios)!');
           return;
      }

      const loggedInUserId = selectedParticipant.user_id;

      const friendAssignment = assignmentsData.find(
        (a) => a.doador === loggedInUserId && a.tipo_sorteio === 'amigo'
      );

      const enemyAssignment = assignmentsData.find(
        (a) => a.doador === loggedInUserId && a.tipo_sorteio === 'inimigo'
      );

      if (!friendAssignment || !enemyAssignment) {
        setPasswordError('Sorteio incompleto para este participante!');
        return;
      }

      const friend = participants.find(p => p.user_id === friendAssignment.receptor);
      const enemy = participants.find(p => p.user_id === enemyAssignment.receptor);

      if (friend && enemy) {
        setSecretFriend(friend);
        setSecretEnemy(enemy);
        setShowPasswordModal(false);
        setShowAuthMenu(true);
        setPasswordError('');
      } else {
         setPasswordError('Amigo/Inimigo Secreto não encontrado na lista de participantes!');
      }

    } catch (error: any) {
      console.error("Erro no login via API:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
        setPasswordError('Usuário ou senha incorreta!');
      } else {
        setPasswordError('Erro de conexão. Tente novamente.');
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const handleRevealFriend = () => {
    setRevealType('friend');
    setShowAuthMenu(false);
    setShowResultModal(true);
  };

  const handleRevealEnemy = () => {
    setRevealType('enemy');
    setShowAuthMenu(false);
    setShowResultModal(true);
  };

  const handleOpenPreferences = () => {
    setShowAuthMenu(false);
    setShowPreferencesModal(true);
  };

  const handleCloseAll = () => {
    setShowPasswordModal(false);
    setShowAuthMenu(false);
    setShowResultModal(false);
    setShowPreferencesModal(false);
    setSelectedParticipant(null);
    setPasswordError('');
    setRevealType(null);
  };

  const handleClosePreferences = () => {
    setShowPreferencesModal(false);
    setShowAuthMenu(true);
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    setShowAuthMenu(true);
  };

  return (
    <div className="min-h-screen bg-black transition-colors duration-500">
      <Snowfall />

      <div className="relative z-20 container mx-auto px-4 py-12">
        {view === 'home' ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl md:text-8xl font-bold text-white text-center mb-6 glow-text">
              SORTEIO DO AMIGO SECRETO
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 text-center mb-12 max-w-2xl">
              Entre no espírito natalino e descubra quem será seu Amigo ou Inimigo Secreto!
            </p>

            <button
              onClick={() => setView('userlist')}
              className="flex items-center gap-4 px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-110 shadow-xl bg-gray-800 text-red-500 hover:bg-red-500 hover:text-black border-2 border-red-500"
            >
              <Users size={32} />
              LISTA DE USUÁRIOS
            </button>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h1 className="text-5xl md:text-6xl font-bold text-red-500 glow-text">
                LISTA DE USUÁRIOS
              </h1>

              <button
                onClick={() => setView('home')}
                className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-gray-700 text-white hover:bg-gray-600 border-2 border-gray-500"
              >
                <Home size={24} />
                MENU
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {participants.map((participant) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  onClick={() => handleParticipantClick(participant)}
                  theme="enemy"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showPasswordModal && selectedParticipant && (
        <PasswordModal
          participantName={selectedParticipant.name}
          onSubmit={handlePasswordSubmit}
          onClose={handleCloseAll}
          theme="enemy"
          error={passwordError}
        />
      )}

      {showAuthMenu && selectedParticipant && (
        <AuthenticatedMenu
          participantName={selectedParticipant.name}
          onClose={handleCloseAll}
          onRevealFriend={handleRevealFriend}
          onRevealEnemy={handleRevealEnemy}
          onOpenPreferences={handleOpenPreferences}
        />
      )}

      {showResultModal && selectedParticipant && secretFriend && secretEnemy && revealType && (
        <ResultModal
          participant={selectedParticipant}
          secretFriend={secretFriend}
          secretEnemy={secretEnemy}
          onClose={handleCloseResult}
          theme={revealType}
        />
      )}

      {showPreferencesModal && selectedParticipant && (
        <PreferencesModal
          participantId={selectedParticipant.id}
          participantName={selectedParticipant.name}
          onClose={handleClosePreferences}
        />
      )}
    </div>
  );
}

export default App;
