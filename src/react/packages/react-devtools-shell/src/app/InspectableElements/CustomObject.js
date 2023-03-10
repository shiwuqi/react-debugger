/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

import * as React from 'react';

class Custom {
  _number = 42;
  get number()         {
    return this._number;
  }
}

export default function CustomObject()             {
  return <ChildComponent customObject={new Custom()} />;
}

function ChildComponent(props     ) {
  return null;
}
