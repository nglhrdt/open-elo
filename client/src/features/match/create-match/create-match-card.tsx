import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CreateMatchCardProps = {
  children?: React.ReactNode;
};

export function CreateMatchCard(props: CreateMatchCardProps) {
  const { children } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Match</CardTitle>
      </CardHeader>
      <CardContent>
        <>{children}</>
      </CardContent>
    </Card>
  );
}
