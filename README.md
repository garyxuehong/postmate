This project is inspired by Postman.

# Major features

1. Yaml base api request. Easy to put in git and keep version and share with teams.
2. Multiple environments, allow use case of mix and match envs.
3. Extract data from response for easy api chaining
4. Open api as browser url internally.
5. Support mutual SSL certificates

# Local Dev

`yarn dev`

# Local Build

`yarn build`

# Sample Api Yaml

```yaml
name: My API
certs:
  - domain: xxx.api.mycompany.com
    type: pfx
    file: ../certs/test.p12
    passphrase: ***********
environments:
  - name: PROD
    variables:
      hostname: https://www.mycompany.com
  - name: test
    variables:
      hostname: https://test.mycompany.com
  - name: user1
    variables:
      userId: 123456
      documentNumbers: 123,456,567
collections:
  - name: Api collection 1
    requests:
      - name: Get user profile
        method: GET
        url: |
          ${hostname}/profile
        headers:
          content-type: application/json
    requests:
      - name: Update user profile
        method: POST
        url: |
          ${hostname}/profile
        headers:
          content-type: application/json
        body: |
          {userId: ${userId}, name: 'Bob', gender: '?'}
  - name: Another collection
    requests:
      - name: Another request (browser)
        method: BROWSER
        url: |
          ${hostname}/blah/blah
```
