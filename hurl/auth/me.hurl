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

# Use token
GET {{base_url}}/me
Authorization: Bearer {{TOKEN}}
