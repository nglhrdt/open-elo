GET {{base_url}}/users
HTTP/1.1 200
[Captures]
userID: jsonpath "$[0].id"

GET {{base_url}}/leagues
HTTP/1.1 200
[Captures]
leagueID: jsonpath "$[0].id"

POST {{base_url}}/leagues/{{leagueID}}/join/{{userID}}
Content-Type: application/json
{}
HTTP/1.1 200
