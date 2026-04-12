import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MatchListCardProps = {
  children?: React.ReactNode;
};

export function MatchListCard(props: MatchListCardProps) {
  const { children } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Match List</CardTitle>
      </CardHeader>
      <CardContent>
        <>{children}</>
      </CardContent>
    </Card>
  );
}
