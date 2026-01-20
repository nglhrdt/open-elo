import { updateLeague, type League } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface SeasonSettingsProps {
  league: League;
}

export function SeasonSettings({ league }: SeasonSettingsProps) {
  const queryClient = useQueryClient();
  const [seasonEnabled, setSeasonEnabled] = useState(league.seasonEnabled || false);
  const [seasonEndDate, setSeasonEndDate] = useState(
    league.seasonEndDate ? new Date(league.seasonEndDate).toISOString().split('T')[0] : ''
  );

  const mutation = useMutation({
    mutationFn: (data: { seasonEnabled?: boolean; seasonEndDate?: string }) =>
      updateLeague(league.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league', league.id] });
      alert('Season settings updated successfully');
    },
    onError: (error: Error) => {
      alert(error.message || 'Failed to update season settings');
    },
  });

  const handleSave = () => {
    mutation.mutate({
      seasonEnabled,
      seasonEndDate: seasonEndDate || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Season Settings</CardTitle>
        <CardDescription>
          Configure seasonal play for this league. When a season ends, rankings are saved and all
          player ELOs are reset to 1000.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="seasonEnabled"
            checked={seasonEnabled}
            onChange={(e) => setSeasonEnabled(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="seasonEnabled">Enable Seasons</Label>
        </div>

        {seasonEnabled && (
          <div className="space-y-2">
            <Label htmlFor="seasonEndDate">Season End Date</Label>
            <Input
              type="date"
              id="seasonEndDate"
              value={seasonEndDate}
              onChange={(e) => setSeasonEndDate(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty for ongoing season. When this date is reached, the season will end and a
              new one will start automatically.
            </p>
          </div>
        )}

        {league.currentSeasonNumber && league.currentSeasonNumber > 1 && (
          <div className="text-sm text-muted-foreground">
            Current Season: {league.currentSeasonNumber}
          </div>
        )}

        <Button onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
