export interface Route {
  name: string;
  rate: number;
}

export class ABRouter {
  order: Route[] = [];
  next: number = 0;
  orderLength: number;
  constructor(routes: Record<string, number>) {
    for (const name in routes) {
      let rate = routes[name];
      if (!Number.isInteger(rate)) {
        throw new Error(`Rate must be an integer number! name: ${name}`);
      }
      const route: Route = { name, rate };
      while (rate > 0) {
        rate--;
        this.order.push(route);
      }
    }
    this.orderLength = this.order.length;
  }

  getNext(): Route {
    const route = this.order[this.next];
    this.next++;

    if (this.next === this.orderLength) {
      this.next = 0;
    }

    return route;
  }
}
