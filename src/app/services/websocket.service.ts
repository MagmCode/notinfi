import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client;
  public progress$ = new BehaviorSubject<any>(null); // Emite notificaciones

  constructor() {
    const token = localStorage.getItem('token'); // <-- Aquí obtienes el token

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://180.183.67.228:8080/ws'),
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