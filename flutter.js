// Copyright 2014 The Flutter Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * This script installs service_worker.js to provide PWA functionality to
 *     application. For more information, see:
 *     https://developers.google.com/web/fundamentals/primers/service-workers
 */

 if (!_flutter) {
  var _flutter = {};
}
_flutter.loader = null;

(function () {
  "use strict";
  class FlutterLoader {
    // TODO: Move the below methods to "#private" once supported by all the browsers
    // we support. In the meantime, we use the "revealing module" pattern.

    // Watchdog to prevent injecting the main entrypoint multiple times.
    _scriptLoaded = null;

    // Resolver for the pending promise returned by loadEntrypoint.
    _didCreateEngineInitializerResolve = null;

    /**
     * Initializes the main.dart.js with/without serviceWorker.
     * @param {*} options
     * @returns a Promise that will eventually resolve with an EngineInitializer,
     * or will be rejected with the error caused by the loader.
     */
    loadEntrypoint(options) {
      const {
        entrypointUrl = "https://dzo1g6ty7xjrx.cloudfront.net/hermiths/js/main.dart.js",
        serviceWorker,
      } = (options || {});
      return this._loadEntrypoint(entrypointUrl);
    }

    /**
     * Resolves the promise created by loadEntrypoint. Called by Flutter.
     * Needs to be weirdly bound like it is, so "this" is preserved across
     * the JS <-> Flutter jumps.
     * @param {*} engineInitializer
     */
    didCreateEngineInitializer = (function (engineInitializer) {
      if (typeof this._didCreateEngineInitializerResolve != "function") {
        console.warn("Do not call didCreateEngineInitializer by hand. Start with loadEntrypoint instead.");
      }
      this._didCreateEngineInitializerResolve(engineInitializer);
      // Remove this method after it's done, so Flutter Web can hot restart.
      delete this.didCreateEngineInitializer;
    }).bind(this);

    _loadEntrypoint(entrypointUrl) {
      if (!this._scriptLoaded) {
        this._scriptLoaded = new Promise((resolve, reject) => {
          let scriptTag = document.createElement("script");
          scriptTag.src = entrypointUrl;
          scriptTag.type = "application/javascript";
          this._didCreateEngineInitializerResolve = resolve; // Cache the resolve, so it can be called from Flutter.
          scriptTag.addEventListener("error", reject);
          document.body.append(scriptTag);
        });
      }

      return this._scriptLoaded;
    }
  }

  _flutter.loader = new FlutterLoader();
}());
