import { ABRouter } from "./src/ABRouter.ts";
import { Server } from "./src/server.ts";

const routes = JSON.parse(Deno.readTextFileSync("./routes.json"));

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
  kavenegarURL: Deno.env.get("KAVENEGAR_URL") || "https://api.kavenegar.com",
};

const routers: Record<string, ABRouter> = {};

for (const templateName in routes) {
  routers[templateName] = new ABRouter(routes[templateName]);
}

console.log(routers);

async function sendToKN(url: string, params: Record<string, string>) {
  let formData = new URLSearchParams();
  for (const key in params) {
    formData.append(key, params[key]);
  }

  console.log(formData);
  console.log(configs.kavenegarURL + url);
  try {
    const r = await fetch(configs.kavenegarURL + url, {
      body: formData,
      method: "POST",
    });
    return r.json();
  } catch (e) {
    console.log(e);
  }
}

new Server(configs.port).setHandler(async (ctx, body: VerifyLookupParams) => {
  if (typeof body?.template === "string") {
    const router = routers[body.template];
    if (router) {
      body.template = router.getNext().name;
    } else {
      console.warn(`No ABTest Router found for template '${body.template}'`);
    }
  } else console.warn(`Body has no template field! ${JSON.stringify(body)}`);

  return sendToKN(ctx.url, body as any);
});
