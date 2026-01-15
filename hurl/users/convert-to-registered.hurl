# Convert a guest user to a registered user
POST {{base_url}}/users/{{GUEST_USER_ID}}/convert-to-registered
Content-Type: application/json
{
  "email": "converted-user@example.com",
  "password": "newpassword123"
}

HTTP/1.1 200
[Asserts]
jsonpath "$.email" == "converted-user@example.com"
jsonpath "$.role" == "user"
jsonpath "$.passwordHash" exists

# Verify the user can now login with new credentials
POST {{base_url}}/login
Content-Type: application/json
{
  "user": "converted-user@example.com",
  "password": "newpassword123"
}

HTTP/1.1 200
[Asserts]
jsonpath "$.token" exists
jsonpath "$.user.email" == "converted-user@example.com"
jsonpath "$.user.role" == "user"
