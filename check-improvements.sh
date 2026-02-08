#!/bin/bash

# 🚀 Script de vérification rapide des améliorations mobile
# Tech Blog - IA & Capital

echo "🔍 Vérification des améliorations mobile et i18n..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASS=0
FAIL=0

# Fonction de test
test_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1 - MANQUANT"
        ((FAIL++))
    fi
}

test_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1/ - MANQUANT"
        ((FAIL++))
    fi
}

echo "📁 Vérification de la structure i18n..."
test_dir "lib/i18n"
test_file "lib/i18n/translations.ts"
test_file "lib/i18n/context.tsx"
test_file "lib/i18n/index.ts"
echo ""

echo "🎨 Vérification des composants..."
test_file "components/LanguageSwitcher.tsx"
test_file "components/Header.tsx"
test_file "components/PostCard.tsx"
test_file "components/FeaturedCarousel.tsx"
test_file "components/PopularArticles.tsx"
test_file "components/Footer.tsx"
test_file "components/Pagination.tsx"
test_file "components/NewsletterForm.tsx"
echo ""

echo "👨‍💼 Vérification du dashboard admin..."
test_file "app/admin/layout.tsx"
test_file "app/admin/AdminLayoutClient.tsx"
test_file "components/admin/AdminSidebar.tsx"
echo ""

echo "📄 Vérification des layouts et pages..."
test_file "app/layout.tsx"
test_file "app/page.tsx"
test_file "app/globals.css"
echo ""

echo "📚 Vérification de la documentation..."
test_file "MOBILE_IMPROVEMENTS.md"
test_file "TRANSLATION_GUIDE.md"
test_file "TESTING_CHECKLIST.md"
test_file "RECAP.md"
test_file "FILES_MODIFIED.md"
echo ""

echo "🔍 Recherche des breakpoints responsive..."
SM_COUNT=$(grep -r "sm:" components/ app/ 2>/dev/null | wc -l)
MD_COUNT=$(grep -r "md:" components/ app/ 2>/dev/null | wc -l)
LG_COUNT=$(grep -r "lg:" components/ app/ 2>/dev/null | wc -l)
XL_COUNT=$(grep -r "xl:" components/ app/ 2>/dev/null | wc -l)

echo "  - sm: breakpoints: $SM_COUNT"
echo "  - md: breakpoints: $MD_COUNT"
echo "  - lg: breakpoints: $LG_COUNT"
echo "  - xl: breakpoints: $XL_COUNT"
TOTAL=$((SM_COUNT + MD_COUNT + LG_COUNT + XL_COUNT))
echo "  - Total: $TOTAL breakpoints responsive"
echo ""

echo "🌐 Recherche des utilisations de i18n..."
USE_LANGUAGE=$(grep -r "useLanguage" components/ app/ 2>/dev/null | wc -l)
TRANSLATIONS=$(grep -r "t(" components/ app/ 2>/dev/null | wc -l)
echo "  - useLanguage(): $USE_LANGUAGE utilisations"
echo "  - t(): $TRANSLATIONS traductions"
echo ""

echo "📱 Recherche des sidebars mobiles..."
MOBILE_OPEN=$(grep -r "mobileOpen" components/ app/ 2>/dev/null | wc -l)
BACKDROP=$(grep -r "backdrop-blur" components/ app/ 2>/dev/null | wc -l)
echo "  - mobileOpen: $MOBILE_OPEN occurrences"
echo "  - backdrop-blur: $BACKDROP occurrences"
echo ""

echo "═══════════════════════════════════════"
echo "📊 Résultat final"
echo "═══════════════════════════════════════"
echo -e "${GREEN}✓ Réussis:${NC} $PASS"
echo -e "${RED}✗ Échecs:${NC} $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 Tous les fichiers sont présents!${NC}"
    echo ""
    echo "✨ Prochaines étapes:"
    echo "  1. Lancer le serveur: npm run dev"
    echo "  2. Tester le changement de langue"
    echo "  3. Tester le menu mobile (< 768px)"
    echo "  4. Tester le dashboard admin mobile"
    echo "  5. Consulter TESTING_CHECKLIST.md pour plus de tests"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Certains fichiers sont manquants!${NC}"
    echo "Vérifiez que toutes les modifications ont été appliquées."
    echo ""
    exit 1
fi
