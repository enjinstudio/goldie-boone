import React from 'react';
export default function Image(props) {
  const { fill, preload, fetchPriority, sizes, ...rest } = props;
  return React.createElement('img', { ...rest, 'data-fill': String(!!fill), 'data-preload': String(!!preload), fetchpriority: fetchPriority, sizes });
}
