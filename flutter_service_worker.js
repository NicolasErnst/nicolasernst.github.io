'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "3aa76826f1fd411f2fbce124d6f97e72",
"index.html": "83f29223696ebc3e4e87360e833984c8",
"/": "83f29223696ebc3e4e87360e833984c8",
"main.dart.js": "ecb47297aee8261691107ef0e82ba107",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "d3a998af5550995e9f7331e1153502bf",
"assets/AssetManifest.json": "2ab6e03a1430d78a3a3275e350e29224",
"assets/NOTICES": "19934b2687aaccca13e352e0ed62b786",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/assets/images/nicolas.jpg": "12708c729d8c5ec08fa7f7f1abdb626b",
"assets/assets/images/pilsner.jpg": "4a541273e35ca992a08da82ff16ae06f",
"assets/assets/images/shot.jpg": "8c865d55a6584ff4b79329493f2eedc0",
"assets/assets/images/jonas.png": "a8e3e4f5b3274d79399d030c84850cde",
"assets/assets/images/bier.jpg": "c2fa0f50675397a0e63ea8cf86f49194",
"assets/assets/audio/open-bottle.mp3": "8dbf98c1244196600eb50b5d8266189d",
"assets/assets/icons/user-outlined.png": "b8982e196d7c86f12143ffa41d2b33a8",
"assets/assets/icons/home-filled.png": "678642f97d96ad0437c11a798e920835",
"assets/assets/icons/big-arrow-left-filled.png": "78136eb6f2b357eec9739b62add892b5",
"assets/assets/icons/arrow-down-filled.png": "3d91a5880d36c457d0f4a8a948428e7e",
"assets/assets/icons/chart-outlined.png": "b96e7b2c22814fd9469627a35119ad5a",
"assets/assets/icons/arrow-right-outlined.png": "6265326a0780bf16b92984685235c5a8",
"assets/assets/icons/user-filled.png": "29479ba0435741580ca9f4a467be6207",
"assets/assets/icons/session-filled.png": "f7d55bbbc71762160c1f1c64d2d0607b",
"assets/assets/icons/arrow-right-filled.png": "f33c6c5e93e85d18bcf9ddca1affefe2",
"assets/assets/icons/check-outlined.png": "15a7b10f9176d4f9ceb205760493e07f",
"assets/assets/icons/check-filled.png": "5ea11e11679eb2df816e9aa46d564f3e",
"assets/assets/icons/arrow-down-outlined.png": "126954ce8c76a615a3d34f757539615c",
"assets/assets/icons/wallet-outlined.png": "8d7a98619ac7168f19d609fb10a9f9a4",
"assets/assets/icons/money-filled.png": "d9ea82178e750cb15d5a6bfe8c79a5bd",
"assets/assets/icons/transaction-filled.png": "a6a6edc6fbcbc6f1c0515a7f10f68889",
"assets/assets/icons/session-outlined.png": "4c7ea14c157674d9a476c68394cdf195",
"assets/assets/icons/money-outlined.png": "fa194c4b97c80176db715ca7ae2fbaee",
"assets/assets/icons/chart-filled.png": "840095273f3ae0dbe4c859c15466f3f4",
"assets/assets/icons/wallet-filled.png": "2f6008d1bc4fa39a8c9539dd4d3423e5",
"assets/assets/icons/home-outlined.png": "e97bc9ce9f140df4f50675bbdfef9e7b",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
