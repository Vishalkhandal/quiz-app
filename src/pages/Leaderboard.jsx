import { useEffect, useState } from 'react'
import { Trophy } from "lucide-react";
import { useFirebase } from '../context/FirebaseContext'

export const Leaderboard = () => {
  const firebase = useFirebase();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    firebase.fetchLeaderboard(10).then(setPlayers);
  }, [firebase]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Trophy className="text-yellow-500 mx-auto mb-4" size={48} />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Leaderboard</h2>
        <p className="text-gray-600">Top performers across all categories</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
          <h3 className="text-xl font-semibold text-white">Global Rankings</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {players.map((player, index) => (
            <div key={player.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-yellow-600' : 'bg-blue-500'
                  }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{player.displayName || player.email}</div>
                  <div className="text-sm text-gray-500">Score: {player.score || 0}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{player.score || 0}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
