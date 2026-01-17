# Login to get token
POST {{base_url}}/login
Content-Type: application/json
{
  "username": "{{username}}",
  "password": "{{password}}"
}

HTTP/1.1 200
[Captures]
TOKEN: jsonpath "$.token"

# Use token
GET {{base_url}}/users
Authorization: Bearer {{TOKEN}}
