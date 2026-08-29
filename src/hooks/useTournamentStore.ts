import { create } from 'zustand';
import type { Tournament } from '../domain/Tournament';

// ── OPFS helper ──
async function getOPFSRoot(): Promise<FileSystemDirectoryHandle> {
  return await navigator.storage.getDirectory();
}

// ── Store type ──
interface TournamentStoreState {
  tournaments: Tournament[];
  activeTournament: Tournament | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;

  refreshTournaments: () => Promise<void>;
  createTournament: (tournament: Tournament) => Promise<void>;
  saveTournament: (tournament: Tournament) => Promise<void>;
  deleteTournament: (tournamentId: string) => Promise<void>;
  setActiveTournament: (tournament: Tournament | null) => void;
}

const isSupported =
  typeof navigator !== 'undefined' &&
  !!navigator.storage &&
  typeof navigator.storage.getDirectory === 'function';

// ── Store ──
export const useTournamentStore = create<TournamentStoreState>((set, get) => ({
  tournaments: [],
  activeTournament: null,
  isLoading: false,
  error: null,
  isSupported,

  setActiveTournament(tournament) {
    set({ activeTournament: tournament });
  },

  async refreshTournaments() {
    if (!isSupported) return;
    set({ isLoading: true, error: null });
    try {
      const root = await getOPFSRoot();
      const tournaments: Tournament[] = [];
      for await (const entry of root.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          try {
            const file = await entry.getFile();
            const text = await file.text();
            const data = JSON.parse(text) as Tournament;
            data.Date = new Date(data.Date);
            tournaments.push(data);
          } catch {
            // skip corrupted files
          }
        }
      }
      tournaments.sort((a, b) => a.Name.localeCompare(b.Name));

      // Keep activeTournament in sync: if the previous one still exists,
      // use the fresh object from the list; otherwise default to the first.
      const prev = get().activeTournament;
      const activeTournament =
        prev && tournaments.some((t) => t.Id === prev.Id)
          ? tournaments.find((t) => t.Id === prev.Id)!
          : tournaments[0] ?? null;

      set({ tournaments, activeTournament, isLoading: false });
    } catch (err) {
      set({ error: `Fehler beim Lesen: ${err}`, isLoading: false });
    }
  },

  async createTournament(tournament) {
    set({ error: null });
    try {
      const root = await getOPFSRoot();
      const fileHandle = await root.getFileHandle(`${tournament.Id}.json`, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(tournament, null, 2));
      await writable.close();
      await get().refreshTournaments();
    } catch (err) {
      set({ error: `Turnier konnte nicht erstellt werden: ${err}` });
      throw err;
    }
  },

  async saveTournament(tournament) {
    set({ error: null });
    try {
      const root = await getOPFSRoot();
      const fileHandle = await root.getFileHandle(`${tournament.Id}.json`);
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(tournament, null, 2));
      await writable.close();
      await get().refreshTournaments();
    } catch (err) {
      set({ error: `Turnier konnte nicht gespeichert werden: ${err}` });
      throw err;
    }
  },

  async deleteTournament(tournamentId) {
    set({ error: null });
    try {
      const root = await getOPFSRoot();
      await root.removeEntry(`${tournamentId}.json`);
      await get().refreshTournaments();

      // If the deleted tournament was active, fall back to the first
      if (get().activeTournament?.Id === tournamentId) {
        const remaining = get().tournaments;
        set({ activeTournament: remaining[0] ?? null });
      }
    } catch (err) {
      set({ error: `Turnier konnte nicht gelöscht werden: ${err}` });
      throw err;
    }
  },
}));

// ── Load tournaments on first import ──
if (isSupported) {
  useTournamentStore.getState().refreshTournaments();
}
