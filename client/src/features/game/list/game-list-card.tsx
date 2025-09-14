import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GameListCardProps = {
  children?: React.ReactNode;
}

export function GameListCard(props: GameListCardProps) {
  const { children } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Game List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <>
          {children}
        </>
      </CardContent>
    </Card>
  )
}
