import {
  fetchOwnedLeagues,
  fetchUserAvailableLeagues,
  fetchUserJoinedLeagues,
  type User,
} from '@/api/api';
import { useQueries } from '@tanstack/react-query';
import { LeagueListItem } from './league-list-item';

export function LeagueList(props: { user: User }) {
  const { user } = props;
  const [
    { data: availableLeagues },
    { data: joinedLeagues },
    { data: ownedLeagues },
  ] = useQueries({
    queries: [
      {
        queryKey: ['users', user.id, 'available-leagues'],
        queryFn: () => fetchUserAvailableLeagues(user.id),
      },
      {
        queryKey: ['users', user.id, 'joined-leagues'],
        queryFn: () => fetchUserJoinedLeagues(user.id),
      },
      {
        queryKey: ['users', user.id, 'owned-leagues'],
        queryFn: () => fetchOwnedLeagues(user.id),
      },
    ],
  });

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
