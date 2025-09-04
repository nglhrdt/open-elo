import { joinLeague } from "@/api/api";
import { AuthContext } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

export function JoinLeagueButton(props: { leagueId: string | null }) {

  const { user } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: joinLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      queryClient.invalidateQueries({ queryKey: ['rankings', user?.id] });
    },
  })

  function handleJoin() {
    if (!props.leagueId) return;
    mutation.mutate(props.leagueId);
  }

  return <Button onClick={handleJoin} disabled={!props?.leagueId || mutation.isPending}>Join</Button>
}
