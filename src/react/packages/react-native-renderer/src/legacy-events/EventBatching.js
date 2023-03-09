/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *      
 */

import {rethrowCaughtError} from 'shared/ReactErrorUtils';

                                                                   
import accumulateInto from './accumulateInto';
import forEachAccumulated from './forEachAccumulated';
import {executeDispatchesInOrder} from './EventPluginUtils';

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
let eventQueue                                                      = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */
const executeDispatchesAndRelease = function (event                     ) {
  if (event) {
    executeDispatchesInOrder(event);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};
// $FlowFixMe[missing-local-annot]
const executeDispatchesAndReleaseTopLevel = function (e) {
  return executeDispatchesAndRelease(e);
};

export function runEventsInBatch(
  events                                                         ,
) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events);
  }

  // Set `eventQueue` to null before processing it so that we can tell if more
  // events get enqueued while processing.
  const processingEventQueue = eventQueue;
  eventQueue = null;

  if (!processingEventQueue) {
    return;
  }

  forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);

  if (eventQueue) {
    throw new Error(
      'processEventQueue(): Additional events were enqueued while processing ' +
        'an event queue. Support for this has not yet been implemented.',
    );
  }

  // This would be a good time to rethrow if any of the event handlers threw.
  rethrowCaughtError();
}