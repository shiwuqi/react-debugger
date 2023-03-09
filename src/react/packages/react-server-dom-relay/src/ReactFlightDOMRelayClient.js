/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                               

                                                                 

import {
  createResponse,
  resolveModel,
  resolveModule,
  resolveErrorDev,
  resolveErrorProd,
  close,
  getRoot,
} from 'react-client/src/ReactFlightClient';

export {createResponse, close, getRoot};

export function resolveRow(response          , chunk             )       {
  if (chunk[0] === 'O') {
    // $FlowFixMe unable to refine on array indices
    resolveModel(response, chunk[1], chunk[2]);
  } else if (chunk[0] === 'I') {
    // $FlowFixMe unable to refine on array indices
    resolveModule(response, chunk[1], chunk[2]);
  } else {
    if (__DEV__) {
      resolveErrorDev(
        response,
        chunk[1],
        // $FlowFixMe: Flow doesn't support disjoint unions on tuples.
        chunk[2].digest,
        // $FlowFixMe: Flow doesn't support disjoint unions on tuples.
        chunk[2].message || '',
        // $FlowFixMe: Flow doesn't support disjoint unions on tuples.
        chunk[2].stack || '',
      );
    } else {
      // $FlowFixMe: Flow doesn't support disjoint unions on tuples.
      resolveErrorProd(response, chunk[1], chunk[2].digest);
    }
  }
}
