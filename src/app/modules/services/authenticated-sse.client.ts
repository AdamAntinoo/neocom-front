import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type SseEvent = { type: string; data: string };

/**
 * Fetch-based SSE helper so auth cookies/headers work reliably (FASSE-009).
 * Bridges the stream into an RxJS Observable for panels.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticatedSseClient {
  open(url: string, init?: RequestInit): Observable<SseEvent> {
    return new Observable<SseEvent>((subscriber) => {
      const controller = new AbortController();
      const headers = new Headers(init?.headers);
      if (!headers.has('Accept')) {
        headers.set('Accept', 'text/event-stream');
      }

      void (async () => {
        try {
          const response = await fetch(url, {
            ...init,
            headers,
            credentials: 'include',
            signal: controller.signal,
          });
          if (!response.ok || !response.body) {
            subscriber.error(new Error(`SSE open failed: HTTP ${response.status}`));
            return;
          }
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let eventType = 'message';
          let dataLines: string[] = [];

          const flush = () => {
            if (dataLines.length === 0) {
              eventType = 'message';
              return;
            }
            subscriber.next({ type: eventType, data: dataLines.join('\n') });
            eventType = 'message';
            dataLines = [];
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              flush();
              subscriber.complete();
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (line === '') {
                flush();
                continue;
              }
              if (line.startsWith('event:')) {
                eventType = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                dataLines.push(line.slice(5).trimStart());
              }
            }
          }
        } catch (err) {
          if ((err as Error).name === 'AbortError') {
            subscriber.complete();
          } else {
            subscriber.error(err);
          }
        }
      })();

      return () => controller.abort();
    });
  }
}
