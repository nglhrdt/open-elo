import type { League } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

export function LeagueListItem(props: { league: League }) {
  const { league } = props;

  return (
    <Link to={`/leagues/${league.id}`} className="block transition-opacity hover:opacity-80">
      <Card>
        <CardHeader>
          <CardTitle>{league.name}</CardTitle>
          <CardContent>
            {league.type}
          </CardContent>
        </CardHeader>
      </Card>
    </Link>
  );
}
