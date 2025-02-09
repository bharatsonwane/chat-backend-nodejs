import { validateRequest } from "./validationMiddleware.js";
import { bearerAuth, docRegistry } from "../doc/openAPIDocumentGenerator.js";
import { commonDocCreator } from "../doc/openAPIDocumentGenerator.js";

class RouteRegistrar {
  constructor(router, { basePath = "", tags = [] }) {
    this.router = router;
    this.basePath = basePath;
    this.tags = tags;
  }

  registerRoute(
    method,
    path,
    { middleware = [], controller , openApiDoc, requestSchema,  responseSchemas}
  ) {
    const fullRoutePath = `${this.basePath}${path}`;

    const docFullPath = fullRoutePath.replace(/:\w+/g, "{id}");
    const middlewares = [];

    const openApiDocConfig = {
      routePath: docFullPath,
      method,
      tags: this.tags,
      requestSchema,
      responseSchemas
    };

    if (middleware?.length > 0) {
      openApiDocConfig.security = [{ [bearerAuth.name]: [] }];
    }

    if (openApiDoc) {
      // Check if middleware is present in the middleware array

      openApiDoc(openApiDocConfig);
    } else {
      commonDocCreator(openApiDocConfig);
    }

    if (requestSchema) {
      const { bodySchema, querySchema, paramsSchema } = requestSchema;
      middlewares.push(
        validateRequest({ bodySchema, querySchema, paramsSchema })
      );
    }

    if (middleware?.length > 0) {
      middlewares.push(...middleware);
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
