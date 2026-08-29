import type { Match } from "../domain/Match";
import type { Team } from "../domain/Team";

const MatchScoreSheet = ({match}: {match: Match}) => {
  const renderTeamSection = (team: Team, opponentTeam: Team) => {
    return (
      <div className="grid grid-rows-[auto_auto_2.5rem_2.5rem_3rem] border-r border-black last:border-r-0">
        {/* Header mit Team-Name und BibNumber */}
        <div className="grid grid-cols-[1fr_3rem] border-b border-black text-sm">
          <div className="p-2 text-center tracking-wider bg-gray-50 flex items-center justify-center">
            {team.Name}
          </div>
          <div className="border-l border-black p-2 text-center flex items-center justify-center bg-gray-50">
            {team.BibNumber}
          </div>
        </div>

        {/* Durchgänge Header (1 bis 6 + Summe) */}
        <div className="grid grid-cols-[repeat(6,1fr)_4rem] border-b border-black text-xs font-medium text-center bg-gray-100">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} className="border-r border-black py-1.5 last:border-r-0">
              {col}
            </div>
          ))}
          <div className="py-1.5 font-bold">Summe</div>
        </div>

        {/* Zeile 1 (Leer) */}
        <div className="grid grid-cols-[repeat(6,1fr)_4rem] border-b border-black">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} className="border-r border-black last:border-r-0"></div>
          ))}
          <div></div>
        </div>

        {/* Zeile mit Strichen "-" wie im Originalbild */}
        <div className="grid grid-cols-[repeat(6,1fr)_4rem] border-b border-black text-center text-gray-400 text-sm">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} className="border-r border-black last:border-r-0 flex items-center justify-center">
              -
            </div>
          ))}
          <div className="flex items-center justify-center"></div>
        </div>

        {/* Unterschriften- & Summenfeld */}
        <div className="grid grid-cols-[1fr_4.125rem] border-b border-black">
          <div className="p-2 text-[10px] text-gray-500 flex items-end">
            Unterschrift {opponentTeam.Name}
          </div>
          <div className="border-l border-black flex items-center justify-center text-lg font-bold">
            =
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border-2 border-black font-sans select-none text-black">
      {/* Scoreboard Bereich für Team 1 und Team 2 */}
      <div className="grid grid-cols-2 border-b-2 border-black">
        {renderTeamSection(match.Team1, match.Team2)}
        {renderTeamSection(match.Team2, match.Team1)}
      </div>

      {/* Fußzeile mit Metadaten: Bahn, Anspiel, Runde, Durchgang (Match.Round) */}
      <div className="grid grid-cols-2 text-xs font-semibold bg-white">
        <div className="grid grid-cols-[6rem_4rem_1fr_4rem] border-r border-black">
          <div className="border-r border-black py-2 px-3 flex items-center justify-center bg-gray-50">
            Bahn
          </div>
          <div className="py-2 px-3 flex items-center justify-center text-sm font-bold">
            {match.Court}
          </div>
          <div className="border-x border-black py-2 px-3 flex items-center justify-center bg-gray-50">
            Anspiel
          </div>
          <div className="py-2 px-3 flex items-center justify-center text-sm font-bold">
            {match.Kickoff}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_4rem]">
          <div className="border-r border-black py-2 px-3 flex items-center justify-center bg-gray-50">
            Durchgang
          </div>
          <div className="py-2 px-3 flex items-center justify-center text-sm font-bold">
            {match.Round}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScoreSheet
