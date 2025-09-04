import { createLeague, type LEAGUE_TYPE } from "@/api/api";
import { LeagueTypeSelect } from "@/components/league-type-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function CreateLeague() {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<LEAGUE_TYPE>('TABLE_SOCCER');

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
  })

  async function handleClick() {
    await mutation.mutateAsync({
      name,
      type,
    })

    setName('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create League</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <LeagueTypeSelect onChange={setType} value={type} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick}>Create</Button>
      </CardFooter>
    </Card>
  );
}

export default CreateLeague;
