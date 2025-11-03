import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { getParticipantDetails, updateParticipantPreferences } from '../lib/api';

interface PreferencesModalProps {
  participantId: string;
  participantName: string;
  onClose: () => void;
}

const parsePreferences = (gostos: string | null | undefined): string[] => {
  if (!gostos || gostos.trim() === '') {
    return [];
  }
  
  return gostos.split(',')
    .map(pref => pref.trim())
    .filter(pref => pref !== '');
};

export default function PreferencesModal({
  participantId,
  participantName,
  onClose,
}: PreferencesModalProps) {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPreferences();
  }, [participantId]);

  const loadPreferences = async () => {
    setLoading(true);
    setError('');
    try {
      const participant = await getParticipantDetails(participantId);
      setPreferences(parsePreferences(participant.gostos_pessoais));
    } catch (err) {
      console.error("Erro ao carregar preferências:", err);
      setError("Não foi possível carregar suas preferências.");
    }
    setLoading(false);
  };

  const savePreferences = async (updatedPrefs: string[]) => {
    setLoading(true);
    setError('');
    try {
      const gostosString = updatedPrefs.join(',');
      await updateParticipantPreferences(participantId, gostosString);
      setPreferences(updatedPrefs);
    } catch (err) {
      console.error("Erro ao salvar preferência:", err);
      setError("Não foi possível salvar. Tente novamente.");
    }
    setLoading(false);
  };

  const handleAddPreference = async () => {
    if (!newPreference.trim() || loading) return;

    const newPrefText = newPreference.trim();
    if (preferences.includes(newPrefText)) {
      setNewPreference('');
      return;
    }

    const updatedPrefs = [...preferences, newPrefText];
    await savePreferences(updatedPrefs);
    setNewPreference('');
  };

  const handleDeletePreference = async (preferenceToDelete: string) => {
    if (loading) return;

    const updatedPrefs = preferences.filter(pref => pref !== preferenceToDelete);
    await savePreferences(updatedPrefs);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPreference();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-purple-500/20 to-black border-2 border-purple-500 rounded-2xl p-8 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Preferências de Presente</h2>
        <p className="text-gray-300 mb-6">{participantName}</p>

        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-2 block">
            Adicione palavras-chave sobre seus gostos:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: futebol, games, livros..."
              className="flex-1 px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              disabled={loading}
            />
            <button
              onClick={handleAddPreference}
              disabled={loading || !newPreference.trim()}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus size={24} />
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Suas Preferências:</h3>
          {loading && preferences.length === 0 ? (
             <p className="text-gray-400 text-center py-8">Carregando...</p>
          ) : preferences.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Nenhuma preferência adicionada ainda
            </p>
          ) : (
            <div className="space-y-2">
              {preferences.map((pref, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-white">{pref}</span>
                  <button
                    onClick={() => handleDeletePreference(pref)}
                    disabled={loading}
                    className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}