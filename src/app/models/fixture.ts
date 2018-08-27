export interface A {
    value: number;
    element: number;
}

export interface H {
    value: number;
    element: number;
}

export interface GoalsScored {
    a: A[];
    h: H[];
}

export interface A2 {
    value: number;
    element: number;
}

export interface H2 {
    value: number;
    element: number;
}

export interface Assists {
    a: A2[];
    h: H2[];
}

export interface OwnGoals {
    a: any[];
    h: any[];
}

export interface PenaltiesSaved {
    a: any[];
    h: any[];
}

export interface PenaltiesMissed {
    a: any[];
    h: any[];
}

export interface A3 {
    value: number;
    element: number;
}

export interface YellowCards {
    a: A3[];
    h: any[];
}

export interface RedCards {
    a: any[];
    h: any[];
}

export interface A4 {
    value: number;
    element: number;
}

export interface Saves {
    a: A4[];
    h: any[];
}

export interface A5 {
    value: number;
    element: number;
}

export interface H3 {
    value: number;
    element: number;
}

export interface Bonus {
    a: A5[];
    h: H3[];
}

export interface A6 {
    value: number;
    element: number;
}

export interface H4 {
    value: number;
    element: number;
}

export interface Bps {
    a: A6[];
    h: H4[];
}

export interface Stat {
    goals_scored: GoalsScored;
    assists: Assists;
    own_goals: OwnGoals;
    penalties_saved: PenaltiesSaved;
    penalties_missed: PenaltiesMissed;
    yellow_cards: YellowCards;
    red_cards: RedCards;
    saves: Saves;
    bonus: Bonus;
    bps: Bps;
}

export interface Fixture {
    id: number;
    kickoff_time_formatted: string;
    started: boolean;
    event_day: number;
    deadline_time: Date;
    deadline_time_formatted: string;
    stats: Stat[];
    team_h_difficulty: number;
    team_a_difficulty: number;
    code: number;
    kickoff_time: Date;
    team_h_score: number;
    team_a_score: number;
    finished: boolean;
    minutes: number;
    provisional_start_time: boolean;
    finished_provisional: boolean;
    event: number;
    team_a: number;
    team_h: number;
}
