import { useGetLeagueMembers } from '@/api/hooks/use-leagues';
import UserAvatar from '@/components/user-avatar';
import type { Dispatch, SetStateAction } from 'react';

type RandomPlayersGridProps = {
  leagueId: string;
  selectedPlayers: string[];
  setSelectedPlayers: Dispatch<SetStateAction<string[]>>;
};

export function RandomPlayersGrid({ leagueId, selectedPlayers, setSelectedPlayers }: RandomPlayersGridProps) {
  const { data: members } = useGetLeagueMembers(leagueId);

  return (
    <div className="grid gap-4 grid-cols-4">
      {members?.map((member) => (
        <div
          key={member.id}
          className={
            selectedPlayers.includes(member.id)
              ? 'w-fit rounded-full border-2 border-blue-500 p-1'
              : 'p-1'
          }
          onClick={() => {
            setSelectedPlayers((prev) =>
              prev.includes(member.id)
                ? prev.filter((id) => id !== member.id)
                : [...prev, member.id],
            );
          }}
        >
          <UserAvatar userId={member.id} showName size='size-8'/>
        </div>
      ))}
    </div>
  );
}
