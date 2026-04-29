export type MatchStatus = 'live' | 'upcoming' | 'completed' | 'cancelled';
export type UserRole = 'user' | 'organizer' | 'admin' | 'dev';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  format: string;
  overs: number;
  status: MatchStatus;
  createdBy: string;
  createdAt: any;
  score?: {
    runs: number;
    wickets: number;
    balls: number;
    target?: number;
  };
}

export interface Tournament {
  id: string;
  title: string;
  organizer: string;
  teamsCount: number;
  prizePool: string;
  startDate: string;
  status: 'registration' | 'ongoing' | 'finished';
  description: string;
}
