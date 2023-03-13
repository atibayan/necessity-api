var axios = require("axios");
var request = require("request");

async function requestManagementToken () {
  const client_id = "mJ9NV31yPWyTqEHEaAoP04UQmgfA7JTf"
  const client_secret = "3hImw5qG2T_zJq85hEShwTa8VpIZgWR58q-XwS18xnQjra2hE8F70xlj-_MzU7TD"
  const audience = "https://dev-tyn6e6h8fpc2wjg3.us.auth0.com/api/v2/"
  const grant_type = "client_credentials"

  const { data } = await axios.post(
    'https://dev-tyn6e6h8fpc2wjg3.us.auth0.com/oauth/token',
    {
      client_id: client_id,
      client_secret: client_secret,
      audience: audience,
      grant_type: grant_type
    },
    {
      'Content-Type': 'application/json'
    }
  )

  return data.access_token
}

async function getUserInfo(token) {

  const { data } = await axios.get(
    'https://dev-tyn6e6h8fpc2wjg3.us.auth0.com/api/v2/users',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return data;
}

function createPostLogInAction() {
  // const namespace = 'https://example.example.com'
  // const code = `exports.onExecutePostLogin = async (event, api) => {
  //   const { role } = event.user.app_metadata
  //   if (event.authorization) {
  //     if (role)
  //       api.idToken.setCustomClaim('${namespace}/userRole', role)
  //     else
  //       api.idToken.setCustomClaim('${namespace}/userRole', 'user')
  //   }
  // };`
  // const body = {
  //   "name": "my-action",
  //   "supported_triggers": [
  //     {
  //       "id": "post-login"
  //     }
  //   ],
  //   "code": "module.exports = () => {console.log('Action triggered')}",
  //   "dependencies": [],
  //   "runtime": "node16",
  //   "secrets": []
  // }
}

module.exports = {
    requestManagementToken,
    getUserInfo
};
