import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { TokenService } from '@abp/auth/token.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpClient {

  constructor(private http: Http,private _tokenService: TokenService) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' +this._tokenService.getToken()); 
  }

  get(url): Observable<any> {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url,options)
            .map((response: Response) => <any>response.json() );
            // .catch(this.handleError);
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }
 /* private extractData(res: Response) {
        let body = res.json();
        console.log(body,'result kola veri');

        return body || {};
    }*/ 

    private handleError(error: any) {
      if(error.status!=204){
        console.log(error,'result kola veri');
        return Observable.throw(error.message || error);
      }

  }
}