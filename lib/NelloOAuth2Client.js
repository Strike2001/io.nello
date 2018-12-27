'use strict';

const { URLSearchParams } = require('url');
const {
  OAuth2Client,
  OAuth2Token,
  OAuth2Error,
  fetch,
} = require('homey-oauth2app');

module.exports = class NelloOAuth2Client extends OAuth2Client {

  async onGetTokenByCode({ code }) {
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
		const body = await response.json();
		if(!response.ok)
		  throw new Error(body.error_description || body.error || 'Unknown Error');

		return new OAuth2Token(body);
  }

  async onRefreshToken() {
    // This method isn't implemented on nello
    // We try it regardless

    const token = this.getToken();
    if(!token)
			throw new OAuth2Error('Missing Token');

    this.debug('Refreshing token...');

		if(!token.isRefreshable())
		  throw new OAuth2Error('Token cannot be refreshed');

    const params = new URLSearchParams();
		params.append('grant_type', 'refresh_token');
		params.append('client_id', this._clientId);
		params.append('client_secret', this._clientSecret);
		params.append('refresh_token', token.refresh_token);

		const response = await fetch(this._tokenUrl, {
  		method: 'POST',
  		body: params,
		});
		const body = await response.json();
		if(!response.ok)
		  throw new Error(body.error_description || body.error || 'Unknown Error');

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
