import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJUTFqiUYzZ8LBMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi04MjVuZnQyN3Nyc2NpZXp2LnVzLmF1dGgwLmNvbTAeFw0yNDA2MjIw
NTU3NDJaFw0zODAzMDEwNTU3NDJaMCwxKjAoBgNVBAMTIWRldi04MjVuZnQyN3Ny
c2NpZXp2LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMDdK06QPnc+8nK3oBVtz8qnivE3Z++sSMRvwxDlguu4YApq6HT9ukafbRIn
PQIwmTDPaOTNxVFpdPD8Vq1IKiyv7FksfSbfc3N9Emd7QcNelCqCNA560RrEToHx
6l5LBPSqIGHyNmBf2LzH2ZK69w7IGJk9h7iCQokXbi84at3d4MxCfa89V8pkt/DV
mKqpo7Y3qaAlerIq6UWKBr2GI1YB86VEOlwLDVCbLaej134feySzjIF0KK/CeEOM
q/44EZcZnZIwG7K+H/UUGop70iX6gNr1ulGvt+PfI0JLiqF4rcx2Tz9jDiYZgEGa
rByEQbJsoQchodKJOREP1PEltaECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUxuviFzPWpyDTZe2jkb3AeGKpO+wwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQADMxJPyEBwM4J/rD1kc28y2HGODoUVsoKMT4ETFhv5
xJt31g9xEMROJMPth/rQ22wILMkJ3IH5GbVDDZ6tbenALCLSSUhPRNJVX4HGRu9O
An7ssaVgRfxbDC8G0PvSbr9sSHT7uUwrglGhBHYw8N5h2aQ0rz9vgGr0t7VVpNoA
s3OL9EE6sJQGyYpOADapi+FMn3ekJB+sBzqpfWbKHJ5QAl0rEBrGp1MzSi+b6k4j
Jtl0d1wfSNJNKlIc6LiNp6ynQTZ8dNK/Cf6eVVii64p4mT3YZm8RQ5i8+Slvu6fL
2bKLDpfRsLlfSlMQX0tRE61z0KyIf0/JwrvHS9YFH2xF
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
