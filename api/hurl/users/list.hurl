# Login to get token
POST http://localhost:3000/login
Content-Type: application/json
{
  "username": "nglhrdt",
  "password": "password"
}

HTTP/1.1 200
[Captures]
TOKEN: jsonpath "$.token"

# Use token
GET http://localhost:3000/users
Authorization: Bearer {{TOKEN}}
