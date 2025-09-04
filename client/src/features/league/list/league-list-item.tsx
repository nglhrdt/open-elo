import type { League } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeagueListItem(props: { league: League }) {
  const { league } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{league.name}</CardTitle>
        <CardContent>
          {league.type}
        </CardContent>
      </CardHeader>
    </Card>
  );
}
