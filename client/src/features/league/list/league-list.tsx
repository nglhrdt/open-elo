import {
  useGetUserAvailableLeagues,
  useGetUserJoinedLeagues,
} from '@/api/hooks/use-leagues';
import { useGetUserOwnedLeagues } from '@/api/hooks/use-users';
import type { User } from '@open-elo/shared';
import { LeagueListItem } from './league-list-item';

export function LeagueList(props: { user: User }) {
  const { user } = props;
  const { data: ownedLeagues } = useGetUserOwnedLeagues(user.id);
  const { data: availableLeagues } = useGetUserAvailableLeagues(user.id);
  const { data: joinedLeagues } = useGetUserJoinedLeagues(user.id);

  if (!availableLeagues || !joinedLeagues || !ownedLeagues) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-8">
      {ownedLeagues.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">My Leagues</h2>
          <div className="flex flex-col gap-4">
            {ownedLeagues.map((league) => (
              <LeagueListItem key={league.id} league={league} />
            ))}
          </div>
        </div>
      )}
      {joinedLeagues.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Joined Leagues</h2>
          <div className="flex flex-col gap-4">
            {joinedLeagues.map((league) => (
              <LeagueListItem key={league.id} league={league} />
            ))}
          </div>
        </div>
      )}
      {availableLeagues.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Available Leagues</h2>
          <div className="flex flex-col gap-4">
            {availableLeagues.map((league) => (
              <LeagueListItem key={league.id} league={league} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
