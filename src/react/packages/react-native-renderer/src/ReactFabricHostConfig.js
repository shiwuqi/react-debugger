/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                      
             
                
                                   
                                 
                           
                
             
                         
                            

import {
  mountSafeCallback_NOT_REALLY_SAFE,
  warnForStyleProps,
} from './NativeMethodsMixinUtils';
import {create, diff} from './ReactNativeAttributePayload';

import {dispatchEvent} from './ReactFabricEventEmitter';

import {
  DefaultEventPriority,
  DiscreteEventPriority,
} from 'react-reconciler/src/ReactEventPriorities';

// Modules provided by RN:
import {
  ReactNativeViewConfigRegistry,
  TextInputState,
  deepFreezeAndThrowOnMutationInDev,
} from 'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface';

const {
  createNode,
  cloneNode,
  cloneNodeWithNewChildren,
  cloneNodeWithNewChildrenAndProps,
  cloneNodeWithNewProps,
  createChildSet: createChildNodeSet,
  appendChild: appendChildNode,
  appendChildToSet: appendChildNodeToSet,
  completeRoot,
  registerEventHandler,
  measure: fabricMeasure,
  measureInWindow: fabricMeasureInWindow,
  measureLayout: fabricMeasureLayout,
  unstable_DefaultEventPriority: FabricDefaultPriority,
  unstable_DiscreteEventPriority: FabricDiscretePriority,
  unstable_getCurrentEventPriority: fabricGetCurrentEventPriority,
  setNativeProps,
  getBoundingClientRect: fabricGetBoundingClientRect,
} = nativeFabricUIManager;

const {get: getViewConfigForType} = ReactNativeViewConfigRegistry;

// Counter for uniquely identifying views.
// % 10 === 1 means it is a rootTag.
// % 2 === 0 means it is a Fabric tag.
// This means that they never overlap.
let nextReactTag = 2;

                   
                          
                           
                        
             
                                      
     
  
                                             
                                                         
                                                      
                               
                              
                                     
                           
   
                                   

                                      
                           

                                                  
                                                              
                                                       
                                    
                          
                      
                      
                                                          
            
   

// TODO: Remove this conditional once all changes have propagated.
if (registerEventHandler) {
  /**
   * Register the event emitter with the native bridge
   */
  registerEventHandler(dispatchEvent);
}

/**
 * This is used for refs on host components.
 */
class ReactFabricHostComponent                          {
  _nativeTag        ;
  viewConfig            ;
  currentProps       ;
  _internalInstanceHandle        ;

  constructor(
    tag        ,
    viewConfig            ,
    props       ,
    internalInstanceHandle        ,
  ) {
    this._nativeTag = tag;
    this.viewConfig = viewConfig;
    this.currentProps = props;
    this._internalInstanceHandle = internalInstanceHandle;
  }

  blur() {
    TextInputState.blurTextInput(this);
  }

  focus() {
    TextInputState.focusTextInput(this);
  }

  measure(callback                          ) {
    const {stateNode} = this._internalInstanceHandle;
    if (stateNode != null) {
      fabricMeasure(
        stateNode.node,
        mountSafeCallback_NOT_REALLY_SAFE(this, callback),
      );
    }
  }

  measureInWindow(callback                                  ) {
    const {stateNode} = this._internalInstanceHandle;
    if (stateNode != null) {
      fabricMeasureInWindow(
        stateNode.node,
        mountSafeCallback_NOT_REALLY_SAFE(this, callback),
      );
    }
  }

  measureLayout(
    relativeToNativeNode                                           ,
    onSuccess                                ,
    onFail              /* currently unused */,
  ) {
    if (
      typeof relativeToNativeNode === 'number' ||
      !(relativeToNativeNode instanceof ReactFabricHostComponent)
    ) {
      if (__DEV__) {
        console.error(
          'Warning: ref.measureLayout must be called with a ref to a native component.',
        );
      }

      return;
    }

    const toStateNode = this._internalInstanceHandle.stateNode;
    const fromStateNode =
      relativeToNativeNode._internalInstanceHandle.stateNode;

    if (toStateNode != null && fromStateNode != null) {
      fabricMeasureLayout(
        toStateNode.node,
        fromStateNode.node,
        mountSafeCallback_NOT_REALLY_SAFE(this, onFail),
        mountSafeCallback_NOT_REALLY_SAFE(this, onSuccess),
      );
    }
  }

  unstable_getBoundingClientRect()          {
    const {stateNode} = this._internalInstanceHandle;
    if (stateNode != null) {
      const rect = fabricGetBoundingClientRect(stateNode.node);

      if (rect) {
        return new DOMRect(rect[0], rect[1], rect[2], rect[3]);
      }
    }

    // Empty rect if any of the above failed
    return new DOMRect(0, 0, 0, 0);
  }

  setNativeProps(nativeProps        ) {
    if (__DEV__) {
      warnForStyleProps(nativeProps, this.viewConfig.validAttributes);
    }
    const updatePayload = create(nativeProps, this.viewConfig.validAttributes);

    const {stateNode} = this._internalInstanceHandle;
    if (stateNode != null && updatePayload != null) {
      setNativeProps(stateNode.node, updatePayload);
    }
  }
}

export * from 'react-reconciler/src/ReactFiberHostConfigWithNoMutation';
export * from 'react-reconciler/src/ReactFiberHostConfigWithNoHydration';
export * from 'react-reconciler/src/ReactFiberHostConfigWithNoScopes';
export * from 'react-reconciler/src/ReactFiberHostConfigWithNoTestSelectors';
export * from 'react-reconciler/src/ReactFiberHostConfigWithNoMicrotasks';
export * from 'react-reconciler/src/ReactFiberHostConfigWithNoResources';
export * from 'react-reconciler/src/ReactFiberHostConfigWithNoSingletons';

export function appendInitialChild(
  parentInstance          ,
  child                         ,
)       {
  appendChildNode(parentInstance.node, child.node);
}

export function createInstance(
  type        ,
  props       ,
  rootContainerInstance           ,
  hostContext             ,
  internalInstanceHandle        ,
)           {
  const tag = nextReactTag;
  nextReactTag += 2;

  const viewConfig = getViewConfigForType(type);

  if (__DEV__) {
    for (const key in viewConfig.validAttributes) {
      if (props.hasOwnProperty(key)) {
        deepFreezeAndThrowOnMutationInDev(props[key]);
      }
    }
  }

  const updatePayload = create(props, viewConfig.validAttributes);

  const node = createNode(
    tag, // reactTag
    viewConfig.uiViewClassName, // viewName
    rootContainerInstance, // rootTag
    updatePayload, // props
    internalInstanceHandle, // internalInstanceHandle
  );

  const component = new ReactFabricHostComponent(
    tag,
    viewConfig,
    props,
    internalInstanceHandle,
  );

  return {
    node: node,
    canonical: component,
  };
}

export function createTextInstance(
  text        ,
  rootContainerInstance           ,
  hostContext             ,
  internalInstanceHandle        ,
)               {
  if (__DEV__) {
    if (!hostContext.isInAParentText) {
      console.error('Text strings must be rendered within a <Text> component.');
    }
  }

  const tag = nextReactTag;
  nextReactTag += 2;

  const node = createNode(
    tag, // reactTag
    'RCTRawText', // viewName
    rootContainerInstance, // rootTag
    {text: text}, // props
    internalInstanceHandle, // instance handle
  );

  return {
    node: node,
  };
}

export function finalizeInitialChildren(
  parentInstance          ,
  type        ,
  props       ,
  hostContext             ,
)          {
  return false;
}

export function getRootHostContext(
  rootContainerInstance           ,
)              {
  return {isInAParentText: false};
}

export function getChildHostContext(
  parentHostContext             ,
  type        ,
)              {
  const prevIsInAParentText = parentHostContext.isInAParentText;
  const isInAParentText =
    type === 'AndroidTextInput' || // Android
    type === 'RCTMultilineTextInputView' || // iOS
    type === 'RCTSinglelineTextInputView' || // iOS
    type === 'RCTText' ||
    type === 'RCTVirtualText';

  // TODO: If this is an offscreen host container, we should reuse the
  // parent context.

  if (prevIsInAParentText !== isInAParentText) {
    return {isInAParentText};
  } else {
    return parentHostContext;
  }
}

export function getPublicInstance(instance          )                        {
  if (instance.canonical) {
    return instance.canonical;
  }

  // For compatibility with Paper
  if (instance._nativeTag != null) {
    return instance;
  }

  return null;
}

export function prepareForCommit(containerInfo           )                {
  // Noop
  return null;
}

export function prepareUpdate(
  instance          ,
  type        ,
  oldProps       ,
  newProps       ,
  hostContext             ,
)                {
  const viewConfig = instance.canonical.viewConfig;
  const updatePayload = diff(oldProps, newProps, viewConfig.validAttributes);
  // TODO: If the event handlers have changed, we need to update the current props
  // in the commit phase but there is no host config hook to do it yet.
  // So instead we hack it by updating it in the render phase.
  instance.canonical.currentProps = newProps;
  return updatePayload;
}

export function resetAfterCommit(containerInfo           )       {
  // Noop
}

export function shouldSetTextContent(type        , props       )          {
  // TODO (bvaughn) Revisit this decision.
  // Always returning false simplifies the createInstance() implementation,
  // But creates an additional child Fiber for raw text children.
  // No additional native views are created though.
  // It's not clear to me which is better so I'm deferring for now.
  // More context @ github.com/facebook/react/pull/8560#discussion_r92111303
  return false;
}

export function getCurrentEventPriority()    {
  const currentEventPriority = fabricGetCurrentEventPriority
    ? fabricGetCurrentEventPriority()
    : null;

  if (currentEventPriority != null) {
    switch (currentEventPriority) {
      case FabricDiscretePriority:
        return DiscreteEventPriority;
      case FabricDefaultPriority:
      default:
        return DefaultEventPriority;
    }
  }

  return DefaultEventPriority;
}

// The Fabric renderer is secondary to the existing React Native renderer.
export const isPrimaryRenderer = false;

// The Fabric renderer shouldn't trigger missing act() warnings
export const warnsIfNotActing = false;

export const scheduleTimeout = setTimeout;
export const cancelTimeout = clearTimeout;
export const noTimeout = -1;

// -------------------
//     Persistence
// -------------------

export const supportsPersistence = true;

export function cloneInstance(
  instance          ,
  updatePayload               ,
  type        ,
  oldProps       ,
  newProps       ,
  internalInstanceHandle        ,
  keepChildren         ,
  recyclableInstance                 ,
)           {
  const node = instance.node;
  let clone;
  if (keepChildren) {
    if (updatePayload !== null) {
      clone = cloneNodeWithNewProps(node, updatePayload);
    } else {
      clone = cloneNode(node);
    }
  } else {
    if (updatePayload !== null) {
      clone = cloneNodeWithNewChildrenAndProps(node, updatePayload);
    } else {
      clone = cloneNodeWithNewChildren(node);
    }
  }
  return {
    node: clone,
    canonical: instance.canonical,
  };
}

export function cloneHiddenInstance(
  instance          ,
  type        ,
  props       ,
  internalInstanceHandle        ,
)           {
  const viewConfig = instance.canonical.viewConfig;
  const node = instance.node;
  const updatePayload = create(
    {style: {display: 'none'}},
    viewConfig.validAttributes,
  );
  return {
    node: cloneNodeWithNewProps(node, updatePayload),
    canonical: instance.canonical,
  };
}

export function cloneHiddenTextInstance(
  instance          ,
  text        ,
  internalInstanceHandle        ,
)               {
  throw new Error('Not yet implemented.');
}

export function createContainerChildSet(container           )           {
  return createChildNodeSet(container);
}

export function appendChildToContainerChildSet(
  childSet          ,
  child                         ,
)       {
  appendChildNodeToSet(childSet, child.node);
}

export function finalizeContainerChildren(
  container           ,
  newChildren          ,
)       {
  completeRoot(container, newChildren);
}

export function replaceContainerChildren(
  container           ,
  newChildren          ,
)       {}

export function getInstanceFromNode(node     )        {
  throw new Error('Not yet implemented.');
}

export function beforeActiveInstanceBlur(internalInstanceHandle        ) {
  // noop
}

export function afterActiveInstanceBlur() {
  // noop
}

export function preparePortalMount(portalInstance          )       {
  // noop
}

export function detachDeletedInstance(node          )       {
  // noop
}

export function requestPostPaintCallback(callback                        ) {
  // noop
}

export function prepareRendererToRender(container           )       {
  // noop
}

export function resetRendererAfterRender() {
  // noop
}
