import { supabase } from '../lib/supabase';
import { Match, MatchStatus } from '../types';

const MATCHES_TABLE = 'matches';

export const MatchService = {
  // Create a new match
  async createMatch(matchData: Partial<Match>) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    if (!user) throw new Error('You must be signed in to create a match.');

    const { data, error } = await supabase
      .from(MATCHES_TABLE)
      .insert([
        {
          team_a: matchData.teamA,
          team_b: matchData.teamB,
          format: matchData.format || 'T20',
          overs: matchData.overs || 20,
          status: 'upcoming',
          created_by: user.id,
          score: {
            runs: 0,
            wickets: 0,
            balls: 0,
            overs: 0,
            recentBalls: [],
            history: [],
            battingTeam: matchData.teamA
          }
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Match creation error:", error);
      throw new Error(error.message || 'Failed to create match. Check your connection.');
    }
    
    return data.id;
  },

  // Update match status or score
  async updateMatch(id: string, updates: Partial<Match>) {
    const supabaseUpdates: any = {};
    if (updates.status) supabaseUpdates.status = updates.status;
    if (updates.score) supabaseUpdates.score = updates.score;
    if (updates.teamA) supabaseUpdates.team_a = updates.teamA;
    if (updates.teamB) supabaseUpdates.team_b = updates.teamB;

    const { error } = await supabase
      .from(MATCHES_TABLE)
      .update(supabaseUpdates)
      .eq('id', id);

    if (error) throw error;
  },

  // Get a single match
  async getMatch(id: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from(MATCHES_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    
    // Map database fields to application types
    return {
      id: data.id,
      teamA: data.team_a,
      teamB: data.team_b,
      format: data.format,
      overs: data.overs,
      status: data.status as MatchStatus,
      createdBy: data.created_by,
      createdAt: data.created_at,
      score: data.score
    };
  },

  // Real-time listener for multiple matches
  subscribeToMatches(callback: (matches: Match[]) => void, status?: MatchStatus) {
    // Initial fetch
    let query = supabase.from(MATCHES_TABLE).select('*');
    if (status) {
      query = query.eq('status', status);
    }

    query.then(({ data }) => {
      if (data) {
        callback(data.map(m => ({
          id: m.id,
          teamA: m.team_a,
          teamB: m.team_b,
          format: m.format,
          overs: m.overs,
          status: m.status as MatchStatus,
          createdBy: m.created_by,
          createdAt: m.created_at,
          score: m.score
        })));
      }
    });

    // Real-time subscription
    const subscription = supabase
      .channel('matches_channel')
      .on('postgres_changes' as any, { event: '*', table: MATCHES_TABLE }, async () => {
        // Simple re-fetch on change for now
        const { data } = await query;
        if (data) {
          callback(data.map(m => ({
            id: m.id,
            teamA: m.team_a,
            teamB: m.team_b,
            format: m.format,
            overs: m.overs,
            status: m.status as MatchStatus,
            createdBy: m.created_by,
            createdAt: m.created_at,
            score: m.score
          })));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }
};
