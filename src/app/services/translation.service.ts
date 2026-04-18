import { Injectable, signal, computed } from '@angular/core';
import { translations, TranslationDictionary } from '../i18n/translations';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLocale = signal<'en' | 'sv'>('en');
  private translations = translations;

  locale = this.currentLocale.asReadonly();

  constructor() {
    // Try to get locale from localStorage or URL
    const savedLocale = localStorage.getItem('locale') as 'en' | 'sv' | null;
    const urlLocale = this.getLocaleFromUrl();

    if (urlLocale) {
      this.currentLocale.set(urlLocale);
      localStorage.setItem('locale', urlLocale);
    } else if (savedLocale) {
      this.currentLocale.set(savedLocale);
    }
  }

  private getLocaleFromUrl(): 'en' | 'sv' | null {
    const path = window.location.pathname;
    if (path.startsWith('/sv')) return 'sv';
    if (path.startsWith('/en')) return 'en';
    return null;
  }

  setLocale(locale: 'en' | 'sv'): void {
    this.currentLocale.set(locale);
    localStorage.setItem('locale', locale);

    // Update URL
    const currentPath = window.location.pathname;
    const newPath = `/${locale}`;
    window.history.pushState({}, '', newPath);
  }

  translate(key: string): string | undefined {
    const locale = this.currentLocale();
    const dictionary = this.translations[locale];
    return dictionary ? dictionary[key] : undefined;
  }

  hasTranslation(key: string): boolean {
    const locale = this.currentLocale();
    const dictionary = this.translations[locale];
    return dictionary ? key in dictionary : false;
  }

  get(key: string, fallback?: string): string {
    const translation = this.translate(key);
    return translation !== undefined ? translation : (fallback || key);
  }
}
