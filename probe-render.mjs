import React from 'react';
import { renderToReadableStream } from 'react-dom/server';
const { FrontCover } = await import('./components/front-cover.tsx');
const Doc = () => React.createElement('html', null,
  React.createElement('head', null),
  React.createElement('body', null, React.createElement(FrontCover)));
const s = await renderToReadableStream(React.createElement(Doc));
await s.allReady;
console.log(await new Response(s).text());
