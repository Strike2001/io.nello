'use strict';

const { URLSearchParams } = require('url');
const {
  OAuth2Client,
  OAuth2Token,
  fetch,
} = require('homey-oauth2app');

module.exports = class NelloOAuth2Client extends OAuth2Client {

  async onGetTokenByCode({ code }) {
    console.log('this._redirectUrl', this._redirectUrl)
    const params = new URLSearchParams();
		params.append('grant_type', 'authorization_code');
		params.append('client_id', this._clientId);
		params.append('client_secret', this._clientSecret);
		params.append('redirect_uri', this._redirectUrl);
		params.append('code', code);

		const response = await fetch(this._tokenUrl, {
  		method: 'POST',
  		body: params,
		});
		if(!response.ok)
		  throw new Error(body.error || 'Unknown Error');

		const body = await response.json();
		return new OAuth2Token(body);
  }

  async getLocations() {
    return this.get({
      path: '/locations/',
    }).then(result => result.data);
  }

  async openDoor({ locationId }) {
    return this.put({
      path: `/locations/${locationId}/open/`,
    }).then(result => result.data);
  }

}