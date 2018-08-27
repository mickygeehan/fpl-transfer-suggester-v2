import {Fixture} from './fixture';

export interface CurrentEventFixture {
    is_home: boolean;
    day: number;
    event_day: number;
    month: number;
    id: number;
    opponent: number;
}

export interface NextEventFixture {
    is_home: boolean;
    day: number;
    event_day: number;
    month: number;
    id: number;
    opponent: number;
}

export interface Team {
    id: number;
    current_event_fixture: CurrentEventFixture[];
    next_event_fixture: NextEventFixture[];
    name: string;
    code: number;
    short_name: string;
    unavailable: boolean;
    strength: number;
    position: number;
    played: number;
    win: number;
    loss: number;
    draw: number;
    points: number;
    form?: any;
    link_url: string;
    strength_overall_home: number;
    strength_overall_away: number;
    strength_attack_home: number;
    strength_attack_away: number;
    strength_defence_home: number;
    strength_defence_away: number;
    team_division: number;
    fixtures: Fixture[];
    fixDiff: number;
    fixDiffCss: string;
    opponentsAndDiff: any[];
}
