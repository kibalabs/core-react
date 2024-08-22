import React from 'react';

import { isFragment } from 'react-is';

// https://github.com/grrowl/react-keyed-flatten-children
export const flattenChildren = (children: React.ReactNode, depth = 0, keys: (string | number)[] = [], shouldRemoveEmptyStrings = true): (React.ReactElement | string | number)[] => {
  return React.Children.toArray(children).reduce((acc: React.ReactChild[], node: React.ReactNode, nodeIndex: number) => {
    if (isFragment(node)) {
      acc.push(...flattenChildren(node.props.children, depth + 1, keys.concat(node.key || nodeIndex)));
    } else if (React.isValidElement(node)) {
      acc.push(React.cloneElement(node, { key: keys.concat(String(node.key)).join('.') }));
    } else if (typeof node === 'number') {
      acc.push(node);
    } else if (typeof node === 'string' && (node || !shouldRemoveEmptyStrings)) {
      acc.push(node);
    }
    return acc;
  }, []);
};
