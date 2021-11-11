import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Server } from 'http';
import { Observable, throwError } from 'rxjs';
import { tap,catchError, subscribeOn } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/curstom-response';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly apiUrl = 'any'

  constructor(private _http: HttpClient) { }

  // getServers(): Observable<CustomResponse>{
  //   return this._http.get<CustomResponse>(`http://localhost:8080/server/list`);
  // }

  servers$ = <Observable<CustomResponse>> this._http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)

  );

  save$ = (server: Server) => <Observable<CustomResponse>> this._http.post<CustomResponse>(`${this.apiUrl}/server/save`,server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)

  );

  ping$ = (ipAddress: string) => <Observable<CustomResponse>> this._http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)

  );

  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      subscriber => {
        console.log(response)
        subscriber.next(
          status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status`} :
          {
            ...response, message: response.data.servers
            .filter(server => server.status === status ).length > 0 ?
            `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP': 'SERVER DOWN'} status`
            : `No servers of ${status} found`,
            data: { servers: response.data.servers
              .filter(server => server.status === status )
            }
          }
        );
        subscriber.complete();
      }
    )
  .pipe(
    tap(console.log),
    catchError(this.handleError)

  );

  delete$ = (serverId: number) => <Observable<CustomResponse>> this._http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)

  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    return throwError(`An error ocurred - Error code: ${error.status}`);
  }


}


