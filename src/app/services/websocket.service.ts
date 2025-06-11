import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client;
  public progress$ = new BehaviorSubject<any>(null); // Emite notificaciones
  apiUrl = environment.urlEndPoint; // URL base de tu backend

  constructor() {
    const token = localStorage.getItem('token'); // <-- Aquí obtienes el token

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${this.apiUrl}ws`),
      connectHeaders: {
        Authorization: token ? token : ''
        // Si tu backend espera 'Bearer ...', usa: Authorization: token ? 'Bearer ' + token : ''
      },
      onConnect: () => {
        // Suscribirse a notificaciones generales
        this.client.subscribe('/topic/export-progress', (message) => {
          this.progress$.next(JSON.parse(message.body));
        });

        // Suscribirse a notificaciones privadas (por usuario)
        this.client.subscribe('/user/queue/export-progress', (message) => {
          this.progress$.next(JSON.parse(message.body));
        });
      }
    });
    this.client.activate();
  }
}