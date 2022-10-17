/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

// Use dotenv to read .env vars into Node



const PAGE_ID = '100726456075818';
const APP_ID = '1136797140517500';
const PAGE_ACCESS_TOKEN = 'EAAQJ6TWZBAnwBACIF1went7qALCBScTOGlI6Ae13RmnHZAQ9ZCsuuzCJmK0d2BC1rZC12CkhdnWs1vRtft1jsXGF5UzUF1c2NSn7V5egsq5TZCobYfOJyxdRfiAfI3H5WI7JEsHAQiR5rj6fqlkZC0Xy5JA4IIYvQb42psEYatHThbdhRBeXx0WvQUfej3xOtxyeYhhYJXeAZDZD';
const APP_SECRET = '4f2d2035df9dd79dbc7c649a6f342509';
const VERIFY_TOKEN = 'ambotlangjudnimo';
const APP_URL = 'https://nmscstchatbot.serv00.net:3153';
const SHOP_URL = 'https://nmscstchatbot.serv00.net:3153';


module.exports = {
    // Messenger Platform API
    apiDomain: "https://graph.facebook.com",
    apiVersion: "v11.0",

    // Page and Application information
    pageId: PAGE_ID,
    appId: APP_ID,
    pageAccesToken: PAGE_ACCESS_TOKEN,
    appSecret: APP_SECRET,
    verifyToken: VERIFY_TOKEN,


    // URL of your app domain
    appUrl: APP_URL,

    // URL of your website
    shopUrl: SHOP_URL,

    // Preferred port (default to 3000)
    port: process.env.PORT || 3153,

    // Base URL for Messenger Platform API calls
    get apiUrl() {
        return `${this.apiDomain}/${this.apiVersion}`;
    },

    // URL of your webhook endpoint
    get webhookUrl() {
        return `${this.appUrl}/webhook`;
    },



    get whitelistedDomains() {
        return [this.appUrl, this.shopUrl];
    },

    
};
