/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

const ReactFabricGlobalResponderHandler = {
  onChange: function (from     , to     , blockNativeResponder         ) {
    if (from) {
      // equivalent to clearJSResponder
      nativeFabricUIManager.setIsJSResponder(
        from.stateNode.node,
        false,
        blockNativeResponder || false,
      );
    }

    if (to) {
      // equivalent to setJSResponder
      nativeFabricUIManager.setIsJSResponder(
        to.stateNode.node,
        true,
        blockNativeResponder || false,
      );
    }
  },
};

export default ReactFabricGlobalResponderHandler;
