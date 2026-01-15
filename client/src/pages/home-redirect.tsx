import { fetchUserRankings } from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function HomeRedirect() {
  const navigate = useNavigate();
  const { isPending, data: rankings, isError } = useQuery({
    queryKey: ['rankings'],
    queryFn: fetchUserRankings,
  });

  useEffect(() => {
    if (!isPending) {
      if (rankings && rankings.length > 0) {
        navigate(`/leagues/${rankings[0].league.id}`, { replace: true });
      } else if (rankings && rankings.length === 0) {
        navigate('/leagues', { replace: true });
      } else if (isError || rankings === null) {
        // If there's an error or rankings is null, redirect to leagues
        navigate('/leagues', { replace: true });
      }
    }
  }, [isPending, rankings, isError, navigate]);

  if (isPending) return <div>Loading...</div>;

  return <div>Redirecting...</div>;
}
