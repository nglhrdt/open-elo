import { useGetProfile } from '@/api/hooks/use-profile';
import { RenameUserDialog } from '@/features/player/player-header/rename-user-dialog';

export function ProfilePage() {
  const { data: profile } = useGetProfile();

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6 grow shrink">
      <div className="flex items-center justify-between gap-4 lg:gap-8 shrink-0">
        <div className="flex items-center justify-between gap-4 grow shrink">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <RenameUserDialog userId={profile?.id} />
        </div>
      </div>
    </div>
  );
}
