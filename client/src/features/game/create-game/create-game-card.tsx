import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CreateGameCardProps = {
  children?: React.ReactNode;
}

export function CreateGameCard(props: CreateGameCardProps) {
  const { children } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Create Game
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
