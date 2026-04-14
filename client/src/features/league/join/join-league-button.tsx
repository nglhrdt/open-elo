import { fetchUserJoinedLeagues, joinLeague } from '@/api/api';
import { AuthContext } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

export function JoinLeagueButton(props: { leagueId: string }) {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: joinLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const { data: userLeagues } = useQuery({
    queryKey: ['users', user?.id, 'leagues'],
    queryFn: () => fetchUserJoinedLeagues(user!.id),
    enabled: !!user,
  });

  const isMember =
    userLeagues?.some((league) => league.id === props.leagueId) ?? false;
  const isGuest = user?.role === 'guest';

  function handleJoin() {
    mutation.mutate(props.leagueId);
  }

  if (isMember || isGuest) return null;

  return (
    <Button onClick={handleJoin} disabled={mutation.isPending}>
      Join
    </Button>
  );
}
