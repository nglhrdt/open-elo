import { fetchLeagueById } from '@/api/api';
import { AuthContext } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { useContext, useState } from 'react';
import { SeasonSettings } from './season-settings';

export function SeasonSettingsDialog({ leagueId }: { leagueId: string }) {
  const { user } = useContext(AuthContext);
  const { data: league } = useQuery({
    queryKey: ['leagues', leagueId],
    queryFn: () => fetchLeagueById(leagueId),
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!league || !user) return null;
  const isOwner = user.id === league.owner.id;
  if (!isOwner) return null;

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <SeasonSettings league={league} />
      </DialogContent>
    </Dialog>
  );
}
