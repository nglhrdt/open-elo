import { useCreateLeague } from '@/api/hooks/use-leagues';
import { LeagueTypeSelect } from '@/components/league-type-select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { GAME } from '@open-elo/shared';
import { useState } from 'react';

function CreateLeague() {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<GAME>('TABLE_SOCCER');

  const mutation = useCreateLeague();

  async function handleClick() {
    await mutation.mutateAsync({
      name,
      game: type,
    });

    setName('');
    setType('TABLE_SOCCER');
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
          onChange={(e) => setName(e.target.value)}
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
