import type { Result } from "./Result"
import type { Team } from "./Team"

export interface Tournament {
    Id: string
    Name: string
    Date: Date 
    Courts: number

    Teams: Team[]
    Results: Result[]
}

export const DEFAULT_TOURNAMENT: Tournament = {
    Id: "",
    Courts: 1,
    Date: new Date(),
    Name: "",
    Teams: [],
    Results: [],
}
