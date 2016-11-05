'use strict';

var google = require('googleapis');
var key = require('./oauth.json');

var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
  key.client_id,
  key.client_secret
);
oauth2Client.setCredentials({
  access_token: key.access_token,
  refresh_token: key.refresh_token
});

var cloudprint = google.cloudprint({version: "beta", auth: oauth2Client});

module.exports.print = function (cb) {

  cloudprint.jobs.sumbmit({
    printerid: "48f1f658-f31e-1928-1384-9bf4e78c2595",
    title: "test",
    contentType: 'url',
    ticket: {
      version: "1.0",
      print: {
        reverse_order: {
            reverse_order: false
        },
        page_range: {},
        copies: {
            'copies': 1
        },
        color: {
            type: 'STANDARD_MONOCHROME',
            vendor_id: ''
        },
        fit_to_page: {
            type: 'FIT_TO_PAGE'
        },
        collate: {
            collate: false
        },
        media_size: {
            height_microns: 22000,
            width_microns: 88000,
            is_continuous_feed: true,
            vendor_id: ''
        },
        page_orientation: {
            type: 'LANDSCAPE'
        },
        dpi: {
            vertical_dpi: 300,
            horizontal_dpi: 300
        },
        pages_per_side: {
            layout: 'LEFT_TO_RIGHT_TOP_TO_BOTTOM',
            pages_per_side: 1
        },
        duplex: {
            type: 'NO_DUPLEX'
        }
      }
    },
    content: "http://vignette2.wikia.nocookie.net/clubpenguin/images/2/21/Funny_RP.PNG/revision/latest?cb=20130321223618"
  }, cb);
};