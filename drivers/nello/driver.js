'use strict';

const Homey = require('homey');
const { OAuth2Driver } = require('homey-oauth2app');

module.exports = class NelloDriver extends OAuth2Driver {

	async onPairListDevices({ oAuth2Client }) {
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