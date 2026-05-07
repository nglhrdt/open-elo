import { useGetSeasonById, useSetSeasonEnd } from '@/api/hooks/use-seasons';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface SeasonSettingsProps {
  seasonId: string;
}

export function SeasonSettings({ seasonId }: SeasonSettingsProps) {
  const { data: season } = useGetSeasonById(seasonId);
  const mutation = useSetSeasonEnd(seasonId);
  const [seasonEndDate, setSeasonEndDate] = useState(
    season?.endAt ? new Date(season.endAt).toISOString().split('T')[0] : '',
  );

  const handleSave = () => {
    mutation.mutate({
      endAt: seasonEndDate || undefined,
    });
  };

  if (!season) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Season Settings</DialogTitle>
        <DialogDescription>
          Configure seasonal play for this league. When a season ends, rankings
          are saved and all player ELOs are reset to 1000.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seasonEndDate">Season End Date</Label>
          <Input
            type="date"
            id="seasonEndDate"
            value={seasonEndDate}
            onChange={(e) => setSeasonEndDate(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Leave empty for ongoing season. When this date is reached, the
            season will end and a new one will start automatically.
          </p>
        </div>
        {season.seasonNumber && season.seasonNumber > 1 && (
          <div className="text-sm text-muted-foreground">
            Current Season: {season.seasonNumber}
          </div>
        )}

        <Button onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </>
  );
}
