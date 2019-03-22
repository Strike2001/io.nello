'use strict';

const Homey = require('homey');
const {
  OAuth2Driver
} = require('homey-oauth2app');

module.exports = class NelloDriver extends OAuth2Driver {
  
  async onOAuth2Init() {
    this.triggerWebhookSwipe = new Homey.FlowCardTriggerDevice('webhook_swipe').register();
    this.triggerWebhookGeo = new Homey.FlowCardTriggerDevice('webhook_geo').register();
    this.triggerWebhookTw = new Homey.FlowCardTriggerDevice('webhook_tw').register();
    this.triggerWebhookDeny = new Homey.FlowCardTriggerDevice('webhook_deny').register();
  }

  async onPairListDevices({
    oAuth2Client
  }) {
    const locations = await oAuth2Client.getLocations();
    return locations.map(location => {
      const {
        location_id,
        address,
      } = location;

      return {
        name: `${address.street} ${address.number}`,
        data: {
          id: location_id,
        }
      }
    });
  }

}