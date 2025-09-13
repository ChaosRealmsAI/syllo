import { NetworkRequest } from '../contracts/types';

export class NetworkInterceptor {
  private requests: NetworkRequest[] = [];
  private originalFetch: typeof fetch;
  private originalXhrOpen: typeof XMLHttpRequest.prototype.open;
  private originalXhrSend: typeof XMLHttpRequest.prototype.send;
  
  constructor() {
    this.originalFetch = window.fetch;
    this.originalXhrOpen = XMLHttpRequest.prototype.open;
    this.originalXhrSend = XMLHttpRequest.prototype.send;
  }
  
  start(): void {
    this.interceptFetch();
    this.interceptXHR();
  }
  
  stop(): void {
    window.fetch = this.originalFetch;
    XMLHttpRequest.prototype.open = this.originalXhrOpen;
    XMLHttpRequest.prototype.send = this.originalXhrSend;
  }
  
  getRequests(): NetworkRequest[] {
    return [...this.requests];
  }
  
  clear(): void {
    this.requests = [];
  }
  
  private interceptFetch(): void {
    const self = this;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const timestamp = Date.now();
      const url = input instanceof Request ? input.url : input.toString();
      const method = init?.method || 'GET';
      
      const request: NetworkRequest = {
        timestamp,
        method,
        url,
        headers: self.extractHeaders(init?.headers),
        body: init?.body
      };
      
      try {
        const response = await self.originalFetch(input, init);
        
        // 克隆响应以避免消费body
        const clonedResponse = response.clone();
        
        request.response = {
          status: response.status,
          headers: self.extractResponseHeaders(response.headers),
          body: await self.safeGetResponseBody(clonedResponse)
        };
        
        self.requests.push(request);
        return response;
      } catch (error) {
        request.response = {
          status: 0,
          headers: {},
          body: { error: error.message }
        };
        self.requests.push(request);
        throw error;
      }
    };
  }
  
  private interceptXHR(): void {
    const self = this;
    
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      this._interceptorData = {
        timestamp: Date.now(),
        method,
        url: url.toString(),
        headers: {}
      };
      return self.originalXhrOpen.apply(this, [method, url, ...args]);
    };
    
    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit) {
      if (!this._interceptorData) return self.originalXhrSend.call(this, body);
      
      const request: NetworkRequest = {
        ...this._interceptorData,
        body
      };
      
      this.addEventListener('loadend', () => {
        request.response = {
          status: this.status,
          headers: self.parseResponseHeaders(this.getAllResponseHeaders()),
          body: this.responseText
        };
        self.requests.push(request);
      });
      
      return self.originalXhrSend.call(this, body);
    };
  }
  
  private extractHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {};
    
    if (headers instanceof Headers) {
      const result: Record<string, string> = {};
      headers.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    
    if (Array.isArray(headers)) {
      const result: Record<string, string> = {};
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
      return result;
    }
    
    return headers as Record<string, string>;
  }
  
  private extractResponseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  
  private parseResponseHeaders(headerStr: string): Record<string, string> {
    const headers: Record<string, string> = {};
    headerStr.split('\r\n').forEach(line => {
      const [key, value] = line.split(': ');
      if (key && value) {
        headers[key] = value;
      }
    });
    return headers;
  }
  
  private async safeGetResponseBody(response: Response): Promise<any> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('text/')) {
        return await response.text();
      }
      return null;
    } catch {
      return null;
    }
  }
}

// 扩展XMLHttpRequest类型
declare global {
  interface XMLHttpRequest {
    _interceptorData?: {
      timestamp: number;
      method: string;
      url: string;
      headers: Record<string, string>;
    };
  }
}