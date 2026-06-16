import { Component, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  selector: 'app-game-masters-screen',
  imports: [CommonModule],
  templateUrl: './game-masters-screen.component.html',
  styleUrl: './game-masters-screen.component.css'
})
export class GameMastersScreenComponent {
  isFullscreen = false;

  constructor(
    public gameSystemService: GameSystemService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    this.cdr.markForCheck();
  }

  toggleFullscreen() {
    const el = this.elementRef.nativeElement.querySelector('.gm-screen');
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  strikeRankModifiers = [
    { siz: '22+', sizMod: 0, dex: '19+', dexMod: 0 },
    { siz: '15-21', sizMod: 1, dex: '16-18', dexMod: 1 },
    { siz: '7-14', sizMod: 2, dex: '13-15', dexMod: 2 },
    { siz: '1-6', sizMod: 3, dex: '9-12', dexMod: 3 },
    { dex: '6-8', dexMod: 4 },
    { dex: '1-5', dexMod: 5 }
  ];

  difficultyLevels = [
    { level: 'Fumble', chance: '1-5%', modifier: '-50%' },
    { level: 'Critical Failure', chance: '6-20%', modifier: '' },
    { level: 'Failure', chance: '21-50%', modifier: '' },
    { level: 'Success', chance: '51-95%', modifier: '' },
    { level: 'Critical Success', chance: '96-100%', modifier: '+%' }
  ];

  runesquestHitLocations = [
    { location: 'Right Leg', range: '1-3' },
    { location: 'Left Leg', range: '4-6' },
    { location: 'Abdomen', range: '7-9' },
    { location: 'Chest', range: '10-12' },
    { location: 'Right Arm', range: '13-15' },
    { location: 'Left Arm', range: '16-18' },
    { location: 'Head', range: '19-20' }
  ];

  conditions = [
    { name: 'Prone', effect: 'Melee attackers +20%, ranged attackers -20%' },
    { name: 'Blinded', effect: '-50% to all skills except close combat' },
    { name: 'Poisoned', effect: 'Varies by poison; often damage/round or -skill modifier' },
    { name: 'Stunned', effect: 'Cannot act; roll CON to recover' },
    { name: 'Fatigued', effect: '-5% per fatigue level; can only cast 1 spell/round' },
    { name: 'Confused', effect: 'Cannot take effective actions; react randomly' }
  ];

  magicModifiers = [
    { situation: 'Casting while fatigued', modifier: '-5% per fatigue level' },
    { situation: 'Casting while on horseback', modifier: '-20%' },
    { situation: 'Casting in armor', modifier: '-10% per location' },
    { situation: 'Resisting magic', modifier: 'vs. target\'s skill' }
  ];
}
