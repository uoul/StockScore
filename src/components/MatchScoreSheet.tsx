import type { Match } from "../domain/Match";
import type { Team } from "../domain/Team";

const MatchScoreSheet = ({ match }: { match: Match }) => {
  const renderTeamSection = (team: Team, opponentTeam: Team) => {
    return (
      <div className="grid grid-rows-[auto_auto_2.5rem_3rem] border-r border-black last:border-r-0">
        {/* Header mit Team-Name und BibNumber */}
        <div className="p-2 tracking-wider bg-gray-50 flex items-center gap-2 border-b">
          <span className="p-1 rounded-lg text-xs border border-black text-center">#{team.BibNumber}</span>{team.Name}
        </div>


        {/* Durchgänge Header (1 bis 6 + Summe) */}
        <div className="grid grid-cols-[repeat(7,1fr)] border-b border-black text-xs font-medium text-center bg-gray-100">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} className="border-r border-black py-1.5 last:border-r-0">
              {col}
            </div>
          ))}
          <div className="py-1.5 font-bold">Summe</div>
        </div>

        {/* Zeile 1 (Leer) */}
        <div className="grid grid-cols-[repeat(7,1fr)] border-b border-black">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} className="border-r border-black last:border-r-0"></div>
          ))}
          <div></div>
        </div>

        {/* Unterschriften- & Summenfeld */}
        <div className="grid grid-cols-7 border-b border-black">
          <div className="p-2 text-[10px] text-gray-500 flex items-end col-span-6">
            Unterschrift {opponentTeam.Name}
          </div>
        </div>
      </div>
    );
  };

  return (
    /* KEIN max-w-4xl — volle Druckbreite */
    <div className="w-full bg-white border-2 border-black font-sans select-none text-black">
      {/* Scoreboard Bereich für Team 1 und Team 2 */}
      <div className="grid grid-cols-2 border-b-2 border-black">
        {renderTeamSection(match.Team1, match.Team2)}
        {renderTeamSection(match.Team2, match.Team1)}
      </div>

      {/* Fußzeile mit Metadaten */}
      <div className="grid grid-cols-[auto_auto_auto_1fr] text-xs font-semibold bg-white border-t-0">
        {/* Links: Bahn + Anspiel – alle Spalten 1fr statt fixe rem */}

        <div className="border-r border-black py-2 px-3 flex items-center justify-center bg-gray-50">
          Durchgang {match.Round}
        </div>
        <div className="border-r border-black py-2 px-3 flex items-center justify-center bg-gray-50">
          Bahn {match.Court}
        </div>

        <div className="border-x border-black py-2 px-3 flex items-center justify-center bg-gray-50">
          Anspiel
        </div>
        <div className="py-2 px-3 flex items-center text-sm gap-2">
          <span className="p-1 rounded-lg text-xs border border-black text-center font-thin">#{match.Kickoff}</span>{match.Team1.BibNumber === match.Kickoff ? match.Team1.Name : match.Team2.BibNumber === match.Kickoff ? match.Team2.Name : "ERROR"}
        </div>
      </div>
    </div>
  );

};

export default MatchScoreSheet
