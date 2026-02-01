import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const RELEASE_NOTES_VERSION = '1.0.0'; // Update this when you want to show new release notes
const STORAGE_KEY = 'release-notes-seen';

export function ReleaseNotesDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seenVersion = localStorage.getItem(STORAGE_KEY);
    if (seenVersion !== RELEASE_NOTES_VERSION) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, RELEASE_NOTES_VERSION);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎉 What's New - Season System</DialogTitle>
          <DialogDescription>
            We've introduced a new season system to make your leagues more competitive and fun!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">📅 Seasons</h3>
            <p className="text-sm text-muted-foreground">
              League owners can now enable seasons with configurable end dates. When a season ends:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>All rankings are saved to season history</li>
              <li>Player ELOs are reset to 1000</li>
              <li>A new season automatically begins</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">🕐 Historical Data</h3>
            <p className="text-sm text-muted-foreground">
              View past season performance with the season selector on league and player pages:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Browse historical rankings and games from previous seasons</li>
              <li>Compare your performance across different seasons</li>
              <li>Game creation is disabled when viewing historical seasons</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">⚙️ League Settings</h3>
            <p className="text-sm text-muted-foreground">
              League owners can configure seasons in the Settings menu:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Enable or disable the season system</li>
              <li>Set a season end date or leave it open-ended</li>
              <li>Track which season you're currently in</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">🗑️ Guest User Management</h3>
            <p className="text-sm text-muted-foreground">
              Guest users can now be deleted with some important rules:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Only guest users without games in the current season can be deleted</li>
              <li>Historical data is preserved in past seasons</li>
              <li>Current season rankings are removed upon deletion</li>
            </ul>
          </section>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleClose}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
