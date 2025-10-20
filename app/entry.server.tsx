import type { EntryContext } from "@remix-run/node";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // This is only used for SSR, which is disabled in SPA mode
  // Return a minimal response
  return new Response("SPA Mode - Client-side rendering only", {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
