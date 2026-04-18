# Localization Guide

This application supports multiple languages with URL-based routing and conditional component display.

## Supported Languages

- **English (en)**: `/en`
- **Swedish (sv)**: `/sv`

## How It Works

### URL Routing

The app uses Angular routing to provide language-specific URLs:
- `http://localhost:4202/en` - English version
- `http://localhost:4202/sv` - Swedish version
- Root URL (`/`) automatically redirects to `/en`

### Translation Service

The `TranslationService` manages all translations and locale switching:

```typescript
// Get translation
translationService.get('app.title', 'Fallback Title')

// Check if translation exists
translationService.hasTranslation('section.background')

// Switch language
translationService.setLocale('sv')

// Get current locale
translationService.locale() // Returns 'en' or 'sv'
```

### Component Conditional Display

**Components are only displayed if their heading translation exists.** If a component's heading key is missing from the translation dictionary, the entire component will not be rendered.

This is controlled by the `*appShowIfTranslation` directive:

```html
<app-dice-roller *appShowIfTranslation="'diceRoller.title'"></app-dice-roller>
```

### Adding Translations

Edit [`src/app/i18n/translations.ts`](../src/app/i18n/translations.ts):

```typescript
export const translations = {
  en: {
    'section.newComponent': 'New Component',
    // ... more translations
  },
  sv: {
    'section.newComponent': 'Ny Komponent',
    // ... more translations
  }
};
```

### Component Implementation Pattern

Each component should:

1. Inject `TranslationService`
2. Create a `heading` getter that returns the translation
3. Use `@if` to conditionally render the heading

```typescript
import { TranslationService } from '../../services/translation.service';

export class MyComponent {
  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.myComponent');
  }
}
```

```html
@if (heading) {
<h4>{{ heading }}</h4>
}
<!-- rest of component -->
```

## Language Switcher

The header contains buttons to switch between languages. The active language is highlighted, and switching updates:
- The URL
- All component headings
- Component visibility (components without translations are hidden)
- LocalStorage (persists across sessions)

## Adding a New Language

1. Add translations to `src/app/i18n/translations.ts`
2. Update `TranslationService` to support the new locale type
3. Add route to `src/app/app.routes.ts`
4. Add button to language switcher in `src/app/app.html`

## Current Translation Keys

### Main App
- `app.title` - Application title

### Sections (components)
- `section.background` - Background section
- `section.familyHistory` - Family History section
- `section.characteristics` - Characteristics section
- `section.skills` - Skills section
- `section.derivedStats` - Derived Statistics section
- `section.hitLocations` - Hit Locations section
- `section.armor` - Armor section
- `section.weapons` - Weapons section
- `section.runes` - Runes section
- `section.cultStatus` - Cult Status section
- `section.passions` - Passions section
- `section.magic` - Magic section
- `section.resources` - Resources section
- `section.equipment` - Equipment section
- `section.notes` - Notes section

### Other Components
- `diceRoller.title` - Dice Roller title
- `characterList.title` - Character List title
- `characterList.noCharacters` - No characters message

### Buttons
- `button.save` - Save button
- `button.cancel` - Cancel button
- `button.edit` - Edit button
- `button.delete` - Delete button
- `button.randomize` - Randomize button
