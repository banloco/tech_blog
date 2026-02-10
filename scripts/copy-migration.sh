#!/bin/bash
# Script pour copier le SQL de migration dans le presse-papiers

colors_reset='\033[0m'
colors_green='\033[32m'
colors_yellow='\033[33m'
colors_blue='\033[34m'
colors_cyan='\033[36m'
colors_bold='\033[1m'

echo ""
echo -e "${colors_bold}${colors_blue}════════════════════════════════════════════════════════════════════${colors_reset}"
echo -e "${colors_bold}  📋 Copie du SQL de migration dans le presse-papiers${colors_reset}"
echo -e "${colors_bold}${colors_blue}════════════════════════════════════════════════════════════════════${colors_reset}"
echo ""

# Vérifier si le fichier existe
if [ ! -f "supabase-migration.sql" ]; then
    echo -e "${colors_yellow}❌ Fichier supabase-migration.sql introuvable!${colors_reset}"
    exit 1
fi

# Vérifier si xclip est installé
if command -v xclip &> /dev/null; then
    cat supabase-migration.sql | xclip -selection clipboard
    echo -e "${colors_green}✅ SQL copié dans le presse-papiers avec xclip!${colors_reset}"
    echo ""
elif command -v xsel &> /dev/null; then
    cat supabase-migration.sql | xsel --clipboard
    echo -e "${colors_green}✅ SQL copié dans le presse-papiers avec xsel!${colors_reset}"
    echo ""
elif command -v wl-copy &> /dev/null; then
    cat supabase-migration.sql | wl-copy
    echo -e "${colors_green}✅ SQL copié dans le presse-papiers avec wl-copy (Wayland)!${colors_reset}"
    echo ""
else
    echo -e "${colors_yellow}⚠️  Aucun outil de presse-papiers trouvé${colors_reset}"
    echo ""
    echo -e "${colors_cyan}Pour copier automatiquement, installez un de ces outils:${colors_reset}"
    echo "  • sudo apt install xclip     (X11)"
    echo "  • sudo apt install xsel      (X11)"
    echo "  • sudo apt install wl-clipboard  (Wayland)"
    echo ""
    echo -e "${colors_cyan}Ou copiez manuellement avec:${colors_reset}"
    echo "  cat supabase-migration.sql"
    echo ""
    exit 1
fi

echo -e "${colors_bold}${colors_cyan}📋 Prochaines étapes:${colors_reset}"
echo ""
echo -e "${colors_bold}1. Ouvrir le Dashboard Supabase${colors_reset}"
echo "   → https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx"
echo ""
echo -e "${colors_bold}2. Aller dans SQL Editor${colors_reset}"
echo "   → Menu de gauche > SQL Editor > New Query"
echo ""
echo -e "${colors_bold}3. Coller le SQL${colors_reset}"
echo "   → Le SQL est déjà dans votre presse-papiers!"
echo "   → Faites simplement Ctrl+V dans l'éditeur"
echo ""
echo -e "${colors_bold}4. Exécuter${colors_reset}"
echo "   → Cliquez sur \"Run\" ou Ctrl+Enter"
echo "   → Attendez \"Success ✅\""
echo ""
echo -e "${colors_bold}5. Redémarrer l'application${colors_reset}"
echo "   → ${colors_green}npm run dev${colors_reset}"
echo ""
echo -e "${colors_blue}════════════════════════════════════════════════════════════════════${colors_reset}"
echo ""
