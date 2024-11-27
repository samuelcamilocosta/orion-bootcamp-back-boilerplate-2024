import { Router, Request, Response, NextFunction } from 'express';

// Instância global do router
const router = Router();

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RouteOptions {
  path: string; // Caminho da rota
  method: HttpMethod; // Método HTTP
  middlewares?: Array<
    (req: Request, res: Response, next: NextFunction) => void
  >; // Middlewares opcionais
}

/**
 * Decorator para definir rotas HTTP.
 * @param options {RouteOptions} Opções da rota (path, method, middlewares).
 */
export function HttpRoute({ path, method, middlewares = [] }: RouteOptions) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    router[method](
      path,
      ...middlewares,
      (req: Request, res: Response, next: NextFunction) => {
        originalMethod.call(target, req, res, next);
      }
    );
  };
}

/**
 * Função para obter o router configurado.
 * @returns {Router} O router configurado com as rotas.
 */
export function getRouter(): Router {
  return router;
}
