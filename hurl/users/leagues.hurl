POST {{base_url}}/login
Content-Type: application/json
{
  "user": "{{username}}",
  "password": "{{password}}"
}

HTTP/1.1 200
[Captures]
TOKEN: jsonpath "$.token"

GET {{base_url}}/users
Authorization: Bearer {{TOKEN}}
HTTP/1.1 200
[Captures]
userID: jsonpath "$[16].id"

# Use token
GET {{base_url}}/users/{{userID}}/leagues
Authorization: Bearer {{TOKEN}}
HTTP/1.1 200