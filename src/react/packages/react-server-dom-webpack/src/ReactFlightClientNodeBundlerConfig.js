/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

             
           
                    
                   
                           

                             
                       
                                                     
    
  

                                          

                                              
             
                        
               
  

// eslint-disable-next-line no-unused-vars
                                         
                    
               
  

export function resolveClientReference   (
  bundlerConfig               ,
  metadata                         ,
)                     {
  const resolvedModuleData = bundlerConfig[metadata.id][metadata.name];
  return resolvedModuleData;
}

const asyncModuleCache                             = new Map();

export function preloadModule   (
  metadata                    ,
)                       {
  const existingPromise = asyncModuleCache.get(metadata.specifier);
  if (existingPromise) {
    if (existingPromise.status === 'fulfilled') {
      return null;
    }
    return existingPromise;
  } else {
    // $FlowFixMe[unsupported-syntax]
    const modulePromise              = import(metadata.specifier);
    modulePromise.then(
      value => {
        const fulfilledThenable                           =
          (modulePromise     );
        fulfilledThenable.status = 'fulfilled';
        fulfilledThenable.value = value;
      },
      reason => {
        const rejectedThenable                          = (modulePromise     );
        rejectedThenable.status = 'rejected';
        rejectedThenable.reason = reason;
      },
    );
    asyncModuleCache.set(metadata.specifier, modulePromise);
    return modulePromise;
  }
}

export function requireModule   (metadata                    )    {
  let moduleExports;
  // We assume that preloadModule has been called before, which
  // should have added something to the module cache.
  const promise      = asyncModuleCache.get(metadata.specifier);
  if (promise.status === 'fulfilled') {
    moduleExports = promise.value;
  } else {
    throw promise.reason;
  }
  if (metadata.name === '*') {
    // This is a placeholder value that represents that the caller imported this
    // as a CommonJS module as is.
    return moduleExports;
  }
  if (metadata.name === '') {
    // This is a placeholder value that represents that the caller accessed the
    // default property of this if it was an ESM interop module.
    return moduleExports.default;
  }
  return moduleExports[metadata.name];
}
