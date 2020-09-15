import { http } from "../deps.ts";

export interface HandlerFn<T> {
  (req: http.ServerRequest, body: T): Promise<any>;
}

const decoder = new TextDecoder("utf-8");

async function parseBody(req: http.ServerRequest): Promise<unknown> {
  const b = await Deno.readAll(req.body);
  const raw = decoder.decode(b);
  return JSON.parse(raw);
}

export class Server {
  handler!: HandlerFn<any>;
  constructor(port: number) {
    http.listenAndServe({ port, hostname: "0.0.0.0" }, async (req) => {
      if (req.method !== "POST") {
        return req.respond({ status: 405 });
      }

      const body = await parseBody(req).catch((e) => {
        req.respond({ body: "BAD_JSON", status: 400 });
        console.error(e);
      });

      if (!body) return;

      const result = await this.handler(req, body).catch((e) => {
        req.respond({ status: 500 });
        console.error(e);
      });

      if (!result) return;

      req.respond({ status: 200, body: JSON.stringify(result) });
    });

    console.log(`Start listening in port ${port}`);
  }

  setHandler(h: HandlerFn<any>) {
    this.handler = h;
  }
}
