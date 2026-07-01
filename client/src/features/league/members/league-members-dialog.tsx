import { useGetLeagueById } from "@/api/hooks/use-leagues";
import { AuthContext } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { useContext, useState } from "react";
import LeagueMembersList from "./league-members-list";

type LeagueMembersDialogProps = {
  leagueId: string;
};

function LeagueMembersDialog({ leagueId }: LeagueMembersDialogProps) {
  const { user } = useContext(AuthContext);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: league } = useGetLeagueById(leagueId);

  if (!league || !user) return null;
  const isOwner = user.id === league.ownerId;
  if (!isOwner) return null;
  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users />
          Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <LeagueMembersList leagueId={leagueId} />
      </DialogContent>
    </Dialog>
  );
}

export default LeagueMembersDialog;
