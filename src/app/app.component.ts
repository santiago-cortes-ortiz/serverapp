import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/curstom-response';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  appState$: Observable<AppState<CustomResponse>> ;
  readonly DataState = DataState
  readonly Status = Status
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable()

  constructor(private _serverService: ServerService){
  }

  ngOnInit(): void {
    this.appState$ = this._serverService.servers$
    .pipe(
      map(
        response => {
          this.dataSubject.next(response)
          return { dataState: DataState.LOADED_STATE, appData: response  }
        }
      ),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    )
  }

  pingServer(ipAddress: string): void{
    this.filterSubject.next(ipAddress)
    this.appState$ = this._serverService.ping$(ipAddress)
    .pipe(
      map(
        response => {
          return { dataState: DataState.LOADED_STATE, appData: response  }
        }
      ),
      startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    )
  }

}
