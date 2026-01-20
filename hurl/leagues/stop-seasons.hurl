POST {{base_url}}/leagues/stop-seasons
Content-Type: application/json

HTTP 200
[Asserts]
jsonpath "$.processed" exists
jsonpath "$.results" isCollection
