'use strict';

const Homey = require('homey');
const {
  OAuth2Device
} = require('homey-oauth2app');

const RELOCK_TIMEOUT = 2500;

module.exports = class NelloDevice extends OAuth2Device {

  onOAuth2Init() {
    const { id } = this.getData();
    this._id = id;
    
    this.driver = this.getDriver();
    
    this.log(`Location ID: ${this._id}`);

    if (this.hasCapability('locked')) {
      this.registerCapabilityListener('locked', this._onCapabilityLocked.bind(this));
      this.setCapabilityValue('locked', true);
    }
    
    this.oAuth2Client.createWebhook({
      locationId: this._id,
    }).then(() => {      
      this.log('Webhook registered with Nello');
    }).catch(this.error);
    
    this._homeyWebhook = new Homey.CloudWebhook(Homey.env.WEBHOOK_ID, Homey.env.WEBHOOK_SECRET, {
      locationId: this._id,
    }).on('message', this.onWebhookMessage.bind(this));
    
    this._homeyWebhook
      .register()
      .then(() => {
        this.log('Webhook registered with Homey');
      })
      .catch(this.error);
  }
  
  onOAuth2Deleted() {
    this.oAuth2Client.deleteWebhook({
      locationId: this._id,
    }).then(() => {      
      this.log('Webhook unregistered with Nello');
    }).catch(this.error);
    
    this._homeyWebhook && this._homeyWebhook
      .unregister()
      .then(() => {      
        this.log('Webhook unregistered with Homey');
      }).catch(this.error);
  }
  
  onWebhookMessage( args ) {
    Promise.resolve().then(async () => {
      const { body } = args;
      const { action } = body;
      
      this.log(`Webhook: ${action}`);
      
      if( action === 'swipe' )
        return this.driver.triggerWebhookSwipe.trigger(this);
      
      if( action === 'geo' )
        return this.driver.triggerWebhookGeo.trigger(this);
      
      if( action === 'tw' )
        return this.driver.triggerWebhookTw.trigger(this);
      
      if( action === 'deny' )
        return this.driver.triggerWebhookDeny.trigger(this);
      
    }).catch(this.error);
  }

  async _onCapabilityLocked(value) {
    if (value) return;

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