'use strict';

const Homey = require('homey');
const { OAuth2Device } = require('homey-oauth2app');

const RELOCK_TIMEOUT = 2500;

module.exports = class NelloDevice extends OAuth2Device {

	onOAuth2Init() {
  	const { id } = this.getData();
  	this._id = id;

		if( this.hasCapability('locked') ) {
	  	this.registerCapabilityListener('locked', this._onCapabilityLocked.bind(this));
  		this.setCapabilityValue('locked', true);
		}
	}

	async _onCapabilityLocked( value ) {
  	if(value) return;

  	setTimeout(() => {
      this.setCapabilityValue('locked', true).catch(this.error);
    }, RELOCK_TIMEOUT);

    return this.openDoor();
	}

	async openDoor() {
    return this.oAuth2Client.openDoor({
      locationId: this._id,
    });
	}

}