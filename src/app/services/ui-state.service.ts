import { Injectable, signal } from '@angular/core';

interface UIState {
  fontSize: number; // 12-18, relative to base 14px
  collapsedSections: Record<string, boolean>; // sectionId -> isCollapsed
}

@Injectable({
  providedIn: 'root'
})
export class UIStateService {
  private readonly STORAGE_KEY = 'runequest-ui-state';
  private readonly DEFAULT_FONT_SIZE = 14;
  private readonly MIN_FONT_SIZE = 10;
  private readonly MAX_FONT_SIZE = 20;

  fontSize = signal(this.DEFAULT_FONT_SIZE);
  collapsedSections = signal<Record<string, boolean>>({});

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const state: UIState = JSON.parse(stored);
        this.fontSize.set(Math.max(this.MIN_FONT_SIZE, Math.min(this.MAX_FONT_SIZE, state.fontSize)));
        this.collapsedSections.set(state.collapsedSections || {});
      }
      this.applyFontSize();
    } catch (e) {
      console.warn('Failed to load UI state:', e);
    }
  }

  private saveState(): void {
    try {
      const state: UIState = {
        fontSize: this.fontSize(),
        collapsedSections: this.collapsedSections()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save UI state:', e);
    }
  }

  increaseFontSize(): void {
    const newSize = Math.min(this.MAX_FONT_SIZE, this.fontSize() + 1);
    this.fontSize.set(newSize);
    this.applyFontSize();
    this.saveState();
  }

  decreaseFontSize(): void {
    const newSize = Math.max(this.MIN_FONT_SIZE, this.fontSize() - 1);
    this.fontSize.set(newSize);
    this.applyFontSize();
    this.saveState();
  }

  resetFontSize(): void {
    this.fontSize.set(this.DEFAULT_FONT_SIZE);
    this.applyFontSize();
    this.saveState();
  }

  private applyFontSize(): void {
    document.documentElement.style.fontSize = `${this.fontSize()}px`;
  }

  toggleSection(sectionId: string, collapsed?: boolean): void {
    const sections = { ...this.collapsedSections() };
    sections[sectionId] = collapsed !== undefined ? collapsed : !sections[sectionId];
    this.collapsedSections.set(sections);
    this.saveState();
  }

  isSectionCollapsed(sectionId: string): boolean {
    return this.collapsedSections()[sectionId] ?? false;
  }
}
