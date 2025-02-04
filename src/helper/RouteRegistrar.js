import { validateRequest } from "../helper/httpHandlers.js";

class RouteRegistrar {
  constructor(router, { basePath = "", tags = [] }) {
    this.router = router;
    this.basePath = basePath;
    this.tags = tags;
  }

  registerRoute(method, path, { schema, openApiDoc, middleware, controller }) {
    const fullRoutePath = `${this.basePath}${path}`;

    const middlewares = [];

    if (openApiDoc) {
      openApiDoc({
        routePath: fullRoutePath,
        method,
        tags: this.tags,
      });
    }

    if (middleware) {
      middlewares.push(...middleware);
    }

    if (schema) {
      const { bodySchema, querySchema, paramsSchema } = schema;
      middlewares.push(
        validateRequest({ bodySchema, querySchema, paramsSchema })
      );
    }

    middlewares.push(controller);

    this.router[method](path, ...middlewares);
  }

  get(path, options) {
    this.registerRoute("get", path, options);
  }

  post(path, options) {
    this.registerRoute("post", path, options);
  }

  put(path, options) {
    this.registerRoute("put", path, options);
  }

  delete(path, options) {
    this.registerRoute("delete", path, options);
  }

  patch(path, options) {
    this.registerRoute("patch", path, options);
  }
}

export default RouteRegistrar;
