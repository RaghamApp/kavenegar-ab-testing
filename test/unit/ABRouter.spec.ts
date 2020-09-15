import { ABRouter, Route } from "../../src/ABRouter.ts";
import { assertEquals } from "../asserts.ts";

Deno.test("[unit] ABRouter constructor should work", () => {
  const routes = {
    "test-1": 3,
    "test-2": 2,
    "test-3": 1,
  };

  const router = new ABRouter(routes);

  assertEquals(router.orderLength, 6);
  assertEquals(router.next, 0);

  const t1: Route = { name: "test-1", rate: 3 };
  const t2: Route = { name: "test-2", rate: 2 };
  const t3: Route = { name: "test-3", rate: 1 };
  assertEquals(router.order, [t1, t1, t1, t2, t2, t3]);
});
