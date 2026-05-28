import { useGetLeagueMembers, useJoinLeague } from '@/api/hooks/use-leagues';
import { AuthContext } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';

export function JoinLeagueButton(props: { leagueId: string }) {
  const { user } = useContext(AuthContext);

  const joinLeagueMutation = useJoinLeague(props.leagueId);
  const { data: leagueMembers } = useGetLeagueMembers(props.leagueId);

  const isMember =
    leagueMembers?.some((member) => member.id === user?.id) ?? false;
  const isGuest = user?.role === 'guest';

  function handleJoin() {
    joinLeagueMutation.mutate();
  }

  if (isMember || isGuest) return null;

  return (
    <Button onClick={handleJoin} disabled={joinLeagueMutation.isPending}>
      Join
    </Button>
  );
}
