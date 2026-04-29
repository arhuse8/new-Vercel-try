import { useState, useEffect } from 'react';
import { Match, MatchStatus } from '../types';
import { MatchService } from '../services/matchService';

export function useMatches(status?: MatchStatus) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = MatchService.subscribeToMatches((data) => {
      setMatches(data);
      setLoading(false);
    }, status);

    return () => unsubscribe();
  }, [status]);

  return { matches, loading, error };
}

export function useMatch(id: string) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // Using a simple interval or a snapshot for one match
    setLoading(true);
    const unsubscribe = MatchService.subscribeToMatches((matches) => {
      const found = matches.find(m => m.id === id);
      if (found) setMatch(found);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  return { match, loading };
}
