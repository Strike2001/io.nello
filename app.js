'use strict';

const Homey = require('homey');
const { OAuth2App } = require('homey-oauth2app');
const NelloOAuth2Client = require('./lib/NelloOAuth2Client');

module.exports = class NelloApp extends OAuth2App {

	onOAuth2Init() {
  	//this.enableOAuth2Debug();
  	this.setOAuth2Config({
    	client: NelloOAuth2Client,
      apiUrl: 'https://public-api.nello.io/v1',
      tokenUrl: 'https://auth.nello.io/oauth/token/',
      authorizationUrl: 'https://auth.nello.io/oauth/authorize/',
      scopes: [ 'user' ],
  	});
	}

}