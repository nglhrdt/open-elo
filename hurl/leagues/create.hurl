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

POST {{base_url}}/leagues
Content-Type: application/json
Authorization: Bearer {{TOKEN}}
{
  "name": "{{league_name}}",
  "type": "TABLE_SOCCER"
}