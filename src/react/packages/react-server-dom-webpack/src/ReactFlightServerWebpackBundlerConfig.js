/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                   

                   
                                        
  

                                       

                                                
                   
               
                             
  

                                       

// eslint-disable-next-line no-unused-vars
                                  
                   
               
                   
  

                                       
             
                        
               
                 
  

                                        

const CLIENT_REFERENCE_TAG = Symbol.for('react.client.reference');
const SERVER_REFERENCE_TAG = Symbol.for('react.server.reference');

export function getClientReferenceKey(
  reference                      ,
)                     {
  return reference.$$async ? reference.$$id + '#async' : reference.$$id;
}

export function isClientReference(reference        )          {
  return reference.$$typeof === CLIENT_REFERENCE_TAG;
}

export function isServerReference(reference        )          {
  return reference.$$typeof === SERVER_REFERENCE_TAG;
}

export function resolveClientReferenceMetadata   (
  config               ,
  clientReference                    ,
)                          {
  const resolvedModuleData = config[clientReference.$$id];
  if (clientReference.$$async) {
    return {
      id: resolvedModuleData.id,
      chunks: resolvedModuleData.chunks,
      name: resolvedModuleData.name,
      async: true,
    };
  } else {
    return resolvedModuleData;
  }
}

export function resolveServerReferenceMetadata   (
  config               ,
  serverReference                    ,
)                                                      {
  return {
    id: serverReference.$$id,
    bound: Promise.resolve(serverReference.$$bound),
  };
}
