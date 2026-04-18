import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterUpdateService {
  private characterUpdatedSource = new Subject<void>();

  characterUpdated$ = this.characterUpdatedSource.asObservable();

  notifyCharacterUpdated(): void {
    this.characterUpdatedSource.next();
  }
}
