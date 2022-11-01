/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-3589c0c5'], (function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "assets/index.7b6dfb4c.js",
    "revision": null
  }, {
    "url": "assets/index.f7f25bb9.css",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "dba13dbe931f5d3fa8b1547fd7939af9"
  }, {
    "url": "registerSW.js",
    "revision": "032da5a09364c2984bbc463bf6bfad9e"
  }, {
    "url": "robots.txt",
    "revision": "b6216d61c03e6ce0c9aea6ca7808f7ca"
  }, {
    "url": "img/icons/android-chrome-192x192.png",
    "revision": "d04c37533af74d11e2ad4484dad8f593"
  }, {
    "url": "img/icons/android-chrome-512x512.png",
    "revision": "2de893505e8be5793e4aa6accb8d3fb7"
  }, {
    "url": "img/icons/android-chrome-maskable-192x192.png",
    "revision": "c02abdfcf5e6dca0d07e41ce7495f77c"
  }, {
    "url": "img/icons/android-chrome-maskable-512x512.png",
    "revision": "846890d96a6c93ff0fdeb496d1c07286"
  }, {
    "url": "manifest.webmanifest",
    "revision": "b4b0fc6902e71a4b6ee957ae15ad23a4"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
//# sourceMappingURL=sw.js.map
