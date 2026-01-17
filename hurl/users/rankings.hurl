GET {{base_url}}/users
HTTP/1.1 200
[Captures]
userID: jsonpath "$[0].id"

# Use token
GET {{base_url}}/users/{{userID}}/rankings
