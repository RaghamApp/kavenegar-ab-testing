import { http } from "../deps.ts";
import { multiParser } from "https://github.com/erfanium/multiparser/raw/patch-1/mod.ts";

export interface HandlerFn<T> {
  (req: http.ServerRequest, body: T): Promise<any>;
}

const decoder = new TextDecoder("utf-8");

const headers = new Headers();
headers.set("Content-Type", "application/json; charset=utf-8");
export class Server {
  handler!: HandlerFn<any>;
  constructor(port: number) {
    http.listenAndServe({ port, hostname: "0.0.0.0" }, async (req) => {
      if (req.method !== "POST") {
        return req.respond({ status: 405 });
      }

      const body = await multiParser(req).catch((e) => {
        req.respond({ body: "BAD_BODY", status: 400 });
        console.error(e);
      });

      if (!body) return;

      const result = await this.handler(req, body).catch((e) => {
        req.respond({ status: 500 });
        console.error(e);
      });

      if (!result) return;

      req.respond({
        status: 200,
        body: JSON.stringify(result),
        headers,
      });
    });

    console.log(`Start listening in port ${port}`);
  }

  setHandler(h: HandlerFn<any>) {
    this.handler = h;
  }
}
