GET http://localhost:3000/leagues
HTTP/1.1 200
[Captures]
leagueID: jsonpath "$[0].id"

GET http://localhost:3000/leagues/{{leagueID}}/users
Content-Type: application/json
{}
HTTP/1.1 200
