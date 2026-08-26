declare module 'express' {
  import { IncomingMessage, ServerResponse } from 'http';
  import { ParsedUrlQuery } from 'querystring';

  export interface Request extends IncomingMessage {
    params: Record<string, string>;
    query: ParsedUrlQuery;
    body: any;
    cookies: Record<string, string>;
    ip: string;
    ips: string[];
    hostname: string;
    protocol: string;
    secure: boolean;
    xhr: boolean;
    path: string;
    originalUrl: string;
    baseUrl: string;
  }

  export interface Response extends ServerResponse {
    status(code: number): Response;
    json(body: any): Response;
    send(body: any): Response;
    sendStatus(code: number): Response;
    redirect(url: string): void;
    redirect(status: number, url: string): void;
    render(view: string, locals?: Record<string, any>): void;
    setHeader(name: string, value: string | string[]): void;
    removeHeader(name: string): void;
    cookie(name: string, value: string, options?: any): Response;
    clearCookie(name: string, options?: any): Response;
    end(data?: any): void;
    type(type: string): Response;
    format(object: Record<string, any>): Response;
    attachment(filename?: string): Response;
    download(path: string, filename?: string, options?: any): void;
    links(links: Record<string, string>): Response;
    location(url: string): Response;
    redirect(): void;
    vary(field: string): Response;
  }

  export type NextFunction = (err?: any) => void;

  export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

  export interface Router {
    get(path: string, ...handlers: RequestHandler[]): Router;
    post(path: string, ...handlers: RequestHandler[]): Router;
    put(path: string, ...handlers: RequestHandler[]): Router;
    delete(path: string, ...handlers: RequestHandler[]): Router;
    patch(path: string, ...handlers: RequestHandler[]): Router;
    use(...handlers: RequestHandler[]): Router;
    use(path: string, ...handlers: RequestHandler[]): Router;
    route(path: string): Router;
    param(name: string, handler: (req: Request, res: Response, next: NextFunction, value: any) => void): Router;
  }

  export function Router(): Router;
  export function json(): RequestHandler;
  export function urlencoded(options?: { extended?: boolean }): RequestHandler;
  export function static(root: string, options?: any): RequestHandler;
  export function raw(options?: any): RequestHandler;
  export function text(options?: any): RequestHandler;

  export interface Application {
    use(...handlers: RequestHandler[]): Application;
    use(path: string, ...handlers: RequestHandler[]): Application;
    get(path: string, ...handlers: RequestHandler[]): Application;
    post(path: string, ...handlers: RequestHandler[]): Application;
    put(path: string, ...handlers: RequestHandler[]): Application;
    delete(path: string, ...handlers: RequestHandler[]): Application;
    listen(port: number, callback?: () => void): any;
    listen(port: number, hostname: string, callback?: () => void): any;
    locals: Record<string, any>;
  }

  export default function express(): Application;
}
