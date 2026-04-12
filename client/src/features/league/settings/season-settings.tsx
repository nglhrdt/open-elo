import { setSeasonEnd, type League, type Season } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface SeasonSettingsProps {
  league: League;
}

export function SeasonSettings({ league }: SeasonSettingsProps) {
  const queryClient = useQueryClient();
  const [seasonEndDate, setSeasonEndDate] = useState(
    league.currentSeason.endAt
      ? new Date(league.currentSeason.endAt).toISOString().split('T')[0]
      : '',
  );
  const mutation = useMutation<Season, Error, { endAt?: string }> ({
    mutationFn: (data: { endAt?: string }) =>
      setSeasonEnd(league.currentSeason.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues', league.id] });
      alert('Season settings updated successfully');
    },
    onError: (error: Error) => {
      alert(error.message || 'Failed to update season settings');
    },
  });

  const handleSave = () => {
    mutation.mutate({
      endAt: seasonEndDate || undefined,
    });
  };

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
        {league.currentSeason.seasonNumber &&
          league.currentSeason.seasonNumber > 1 && (
            <div className="text-sm text-muted-foreground">
              Current Season: {league.currentSeason.seasonNumber}
            </div>
          )}

        <Button onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </>
  );
}
