GET http://localhost:3000/users
HTTP/1.1 200
[Captures]
userID: jsonpath "$[0].id"

GET http://localhost:3000/leagues
HTTP/1.1 200
[Captures]
leagueID: jsonpath "$[0].id"

POST http://localhost:3000/leagues/{{leagueID}}/join/{{userID}}
Content-Type: application/json
{}
HTTP/1.1 200
