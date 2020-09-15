import { Server } from "./src/server.ts";

interface VerifyLookupParams {
  receptor: string;
  token: string;
  token2?: string;
  token3?: string;
  token10?: string;
  token20?: string;
  template: string;
  type?: string;
}

const configs = {
  port: Number(Deno.env.get("PORT")) || 3000,
  kavenegarURL: Deno.env.get("KAVENEGAR_URL"),
};

new Server(configs.port).setHandler(async () => {});
