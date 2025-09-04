GET http://localhost:3000/users
HTTP/1.1 200
[Captures]
userID: jsonpath "$[0].id"

# Use token
GET http://localhost:3000/users/{{userID}}/rankings
