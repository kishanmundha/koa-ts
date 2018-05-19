import * as Koa from 'koa';
import * as Stream from 'stream';

// export default (req, res, app) => {
//   const socket = new Stream.Duplex();
//   req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, req);
//   res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, res);
//   req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
//   app = app || new Koa();
//   res.getHeader = (k) => res._headers[k.toLowerCase()];
//   res.setHeader = (k, v) => res._headers[k.toLowerCase()] = v;
//   res.removeHeader = (k, v) => delete res._headers[k.toLowerCase()];
//   return app.createContext(req, res);
// };

// export const request = (req, res, app) => module.exports(req, res, app).request;

// export const response = (req, res, app) => module.exports(req, res, app).response;

export default (req, res) => {
  req = Object.assign({ headers: {}, path: '/' }, req);

  const get = (key: string) => {
    const headerKey = Object.keys(req.headers).filter((hKey) => {
      return key.toLowerCase() === hKey.toLowerCase();
    })[0];

    if (headerKey) {
      return req.headers[headerKey];
    }

    return;
  };

  const ctxThrow = (status, message) => {
    ctx.status = status;
    throw {
      message,
      status,
    };
  };

  const ctx = {
    body: null,
    get,
    path: req.path,
    req,
    request: req,
    status: 200,
    throw: ctxThrow,
  };

  return ctx;
};

interface IRequest {
  path?: string;
  headers?: IHeadder;
  body?: any;
  params?: IParams;
}

interface IHeadder {
  [key: string]: string;
}

interface IParams {
  [key: string]: string;
}

interface IResponse {
  headers?: IHeadder;
  body: any;
}

export class MockContext {
  private _body: any; // tslint:disable-line
  private _status: number;  // tslint:disable-line
  private _request: IRequest;  // tslint:disable-line

  public constructor(request?: IRequest) {
    this._request = request || {};
    this._request.path = this._request.path || '/';
    this._request.headers = this._request.headers || {};
    this._request.params = this._request.params || {};
  }

  public get body() {
    return this._body;
  }

  public set body(value) {
    if (!this._status) {
      this._status = 200;
    }
    this._body = value;
  }

  public get status() {
    return this._status;
  }

  public set status(value) {
    this._status = value;
  }

  public get path(): string {
    return this._request.path;
  }

  public get req(): IRequest {
    return this._request;
  }

  public get request(): IRequest {
    return this._request;
  }

  public get(key: string) {
    const headerKey = Object.keys(this._request.headers).filter((hKey) => {
      return key.toLowerCase() === hKey.toLowerCase();
    })[0];

    if (headerKey) {
      return this._request.headers[headerKey];
    }

    return;
  }

  public get params(): IParams {
    return this._request.params;
  }

  public throw(status, message) {
    // this.status = status;
    // this.body = {
    //   message,
    //   status,
    // };

    throw {
      message,
      status,
    };
  }
}

export const callKoaFunction = async (ctx: MockContext, fn: (ctx: any) => void) => {
  try {
    await fn.call(null, ctx);
  } catch (e) {
    ctx.status = e.status || 500;
    ctx.body = {
      message: e.message,
      status: e.status,
    };
  }
};
