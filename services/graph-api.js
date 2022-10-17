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

// Imports dependencies
//const config = require("./config"),
  ////fetch = require("node-fetch"),
//  { URL, URLSearchParams } = require("url");




module.exports = class GraphApi {
  static async callSendApi(requestBody) {
    let url = new URL(`https://graph.facebook.com/v14.0/100726456075818/messages`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken
    });
    console.warn("Request body is\n" + JSON.stringify(requestBody));
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      console.warn(
        `Unable to call Send API: ${response.statusText}`,
        await response.json()
      );
    }
  }
};
