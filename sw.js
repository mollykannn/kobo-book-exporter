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
define(['./workbox-ab7aa862'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "assets/index-JP4aCdsM.css",
    "revision": null
  }, {
    "url": "assets/index-KtwcuKIQ.js",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "a101d833f9ff27c0bcd29faaa5325091"
  }, {
    "url": "registerSW.js",
    "revision": "032da5a09364c2984bbc463bf6bfad9e"
  }, {
    "url": "robots.txt",
    "revision": "b6216d61c03e6ce0c9aea6ca7808f7ca"
  }, {
    "url": "img/icons/android-chrome-192x192.png",
    "revision": "4ba573ef8ad113593af88dfc92240444"
  }, {
    "url": "img/icons/android-chrome-512x512.png",
    "revision": "5626192099352c0293601ff1380f6a8a"
  }, {
    "url": "img/icons/android-chrome-maskable-192x192.png",
    "revision": "17a5b44a6671d8151f1b3fe1e5bce975"
  }, {
    "url": "img/icons/android-chrome-maskable-512x512.png",
    "revision": "3d4a22e8e8f26f313c4e9964b37f269b"
  }, {
    "url": "manifest.webmanifest",
    "revision": "b4b0fc6902e71a4b6ee957ae15ad23a4"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
//# sourceMappingURL=sw.js.map
