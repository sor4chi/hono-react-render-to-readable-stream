import { Hono } from "hono";
import { renderToReadableStream } from "react-dom/server";
import { Suspense } from "react";

let finished = false;

const DelayComponent = () => {
  if (finished) {
    finished = false;
    return <div>Finished!</div>;
  }

  throw new Promise((resolve) => {
    return setTimeout(() => {
      finished = true;
      resolve(true);
    }, 3000);
  });
};

const App = () => (
  <Suspense fallback={<div>Loading 3 sec...</div>}>
    <DelayComponent />
  </Suspense>
);

const app = new Hono();

app.get("/", async (c) => {
  const stream = await renderToReadableStream(<App />);
  return c.stream((s) => s.pipe(stream));
});

export default app;
