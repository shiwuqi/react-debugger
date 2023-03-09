/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                                

                                                             

                                                                                     

                                                        

import {
  parseModelString,
  parseModelTuple,
} from 'react-client/src/ReactFlightClient';

export {
  preloadModule,
  requireModule,
} from 'ReactFlightNativeRelayClientIntegration';

import {resolveClientReference as resolveClientReferenceImpl} from 'ReactFlightNativeRelayClientIntegration';

import isArray from 'shared/isArray';

                                                                                     

                                 

                                           

                                    

export function resolveClientReference   (
  bundlerConfig               ,
  metadata                         ,
)                     {
  return resolveClientReferenceImpl(metadata);
}

function parseModelRecursively(
  response          ,
  parentObj                                                         ,
  key        ,
  value           ,
)             {
  if (typeof value === 'string') {
    return parseModelString(response, parentObj, key, value);
  }
  if (typeof value === 'object' && value !== null) {
    if (isArray(value)) {
      const parsedValue                    = [];
      for (let i = 0; i < value.length; i++) {
        (parsedValue     )[i] = parseModelRecursively(
          response,
          value,
          '' + i,
          value[i],
        );
      }
      return parseModelTuple(response, parsedValue);
    } else {
      const parsedValue = {};
      for (const innerKey in value) {
        (parsedValue     )[innerKey] = parseModelRecursively(
          response,
          value,
          innerKey,
          value[innerKey],
        );
      }
      return parsedValue;
    }
  }
  return value;
}

const dummy = {};

export function parseModel   (response          , json                    )    {
  return (parseModelRecursively(response, dummy, '', json)     );
}
