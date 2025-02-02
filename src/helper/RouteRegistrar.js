import { validateRequest } from "../helper/httpHandlers.js";

class RouteRegistrar {
  constructor(router) {
    this.router = router;
  }

  registerRoute(method, path, { schema, openApiDoc, middleware, controller }) {
    const middlewares = [];

    if (openApiDoc) {
      openApiDoc();
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

  // Add other HTTP methods as needed
}

export default RouteRegistrar;
