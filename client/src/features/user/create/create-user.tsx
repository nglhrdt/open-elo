import { createUser } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function CreateUser() {
  const [username, setUsername] = useState<string>('');

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  })

  async function handleClick() {
    await mutation.mutateAsync({
      username
    })

    setUsername('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick}>Create</Button>
      </CardFooter>
    </Card>
  );
}

export default CreateUser;
