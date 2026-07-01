import { useGetLeagueMembers } from '@/api/hooks/use-leagues';
import { ScrollArea } from '@/components/ui/scroll-area';
import LeagueMember from './league-member';

type LeagueMembersListProps = {
  leagueId: string;
};

function LeagueMembersList({ leagueId }: LeagueMembersListProps) {
  const { data: members } = useGetLeagueMembers(leagueId);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">League Members</h2>
      <ScrollArea className="h-72 rounded-md border">
        {members?.map((member) => (
          <LeagueMember
            key={member.id}
            leagueId={leagueId}
            userId={member.id}
            username={member.username}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

export default LeagueMembersList;
