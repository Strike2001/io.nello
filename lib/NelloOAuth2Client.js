'use strict';

const { URLSearchParams } = require('url');
const {
  OAuth2Client,
  OAuth2Token,
  OAuth2Error,
  fetch,
} = require('homey-oauth2app');
const Homey = require('homey');

module.exports = class NelloOAuth2Client extends OAuth2Client {

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
  
  async createWebhook({ locationId }) {
    const homeyId = await Homey.ManagerCloud.getHomeyId();
    const url = `https://webhooks.athom.com/webhook/${Homey.env.WEBHOOK_ID}?homey=${homeyId}`;
    
    return this.put({
      path: `/locations/${locationId}/webhook/`,
      json: {
        url,
        actions: [
          'swipe',
          'geo',
          'tw',
          'deny',
        ],
      },
    });
  }
  
  async deleteWebhook({ locationId }) {
    return this.delete({
      path: `/locations/${locationId}/webhook/`,
    });
  }

}
