# Login to get token
POST {{base_url}}/login
Content-Type: application/json
{
  "user": "{{username}}",
  "password": "{{password}}"
}

HTTP/1.1 200
[Captures]
TOKEN: jsonpath "$.token"

GET {{base_url}}/leagues
Authorization: Bearer {{TOKEN}}
HTTP/1.1 200
[Captures]
leagueID: jsonpath "$[0].id"

GET {{base_url}}/leagues/{{leagueID}}/users
Content-Type: application/json
Authorization: Bearer {{TOKEN}}
{}
HTTP/1.1 200
