import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';

export interface DataPort {
  readonly dataPortLabel: string;
  readonly dataPortKey: string;
  exportData(): unknown;
  importData?(rawData: unknown): string;
}

export const DATA_PORT = new InjectionToken<DataPort[]>('DataPort');

@Injectable({ providedIn: 'root' })
export class DataPortService {
  private readonly ports: DataPort[];

  constructor(@Optional() @Inject(DATA_PORT) ports: DataPort[]) {
    // Ports are provided via { provide: DATA_PORT, useExisting: ..., multi: true } in app.config.ts
    this.ports = ports ?? [];
  }

  getAllPorts(): DataPort[] {
    return [...this.ports];
  }
}
