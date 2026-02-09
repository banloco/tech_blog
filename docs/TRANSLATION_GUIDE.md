# Guide d'ajout de traductions

## Comment ajouter une nouvelle clé

1. Ajouter dans `lib/i18n/translations.ts`:
```typescript
export const translations = {
  fr: { myKey: "Ma traduction" },
  en: { myKey: "My translation" }
};
```

2. Utiliser dans un composant:
```tsx
import { useLanguage } from '@/lib/i18n';
const { t } = useLanguage();
<p>{t('myKey')}</p>
```

## Bonnes pratiques
- Clés descriptives (subscribeNewsletter vs btn1)
- Même clés dans toutes les langues
- Tester après chaque ajout
