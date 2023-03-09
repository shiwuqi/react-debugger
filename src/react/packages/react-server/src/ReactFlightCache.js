/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                             

import {
  supportsRequestStorage,
  requestStorage,
} from './ReactFlightServerConfig';

function createSignal()              {
  return new AbortController().signal;
}

function resolveCache()                       {
  if (currentCache) return currentCache;
  if (supportsRequestStorage) {
    const cache = requestStorage.getStore();
    if (cache) return cache;
  }
  // Since we override the dispatcher all the time, we're effectively always
  // active and so to support cache() and fetch() outside of render, we yield
  // an empty Map.
  return new Map();
}

export const DefaultCacheDispatcher                  = {
  getCacheSignal()              {
    const cache = resolveCache();
    let entry                     = (cache.get(createSignal)     );
    if (entry === undefined) {
      entry = createSignal();
      cache.set(createSignal, entry);
    }
    return entry;
  },
  getCacheForType   (resourceType         )    {
    const cache = resolveCache();
    let entry           = (cache.get(resourceType)     );
    if (entry === undefined) {
      entry = resourceType();
      // TODO: Warn if undefined?
      cache.set(resourceType, entry);
    }
    return entry;
  },
};

let currentCache                              = null;

export function setCurrentCache(
  cache                             ,
)                              {
  currentCache = cache;
  return currentCache;
}

export function getCurrentCache()                              {
  return currentCache;
}
