import { joinLeague } from "@/api/api";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function JoinLeagueButton(props: { leagueId: string | null }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: joinLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      queryClient.invalidateQueries({ queryKey: ['userLeagues'] });
      if (props.leagueId) {
        queryClient.invalidateQueries({ queryKey: ['leagueRankings', props.leagueId] });
      }
    },
  })

  function handleJoin() {
    if (!props.leagueId) return;
    mutation.mutate(props.leagueId);
  }

  return <Button onClick={handleJoin} disabled={!props?.leagueId || mutation.isPending}>Join</Button>
}
