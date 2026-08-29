import type { Team } from "./Team"

export interface Match {
  Round: number
  Court: number
  Kickoff: number
  Team1: Team
  Team2: Team
}
