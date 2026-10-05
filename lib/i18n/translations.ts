export const translations = {
  fr: {
    // Header
    home: "Accueil",
    about: "À propos",
    contact: "Contact",
    newsletter: "Newsletter",
    subscribeNewsletter: "S'abonner à la newsletter",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    
    // Hero/Carousel
    featured: "À la une",
    readArticle: "Lire l'article",
    previousArticle: "Article précédent",
    nextArticle: "Article suivant",
    goToSlide: "Aller à la diapositive",
    
    // Articles
    latestAnalyses: "Dernières Analyses",
    searchArticle: "Rechercher un article...",
    noArticlesAvailable: "Aucune analyse disponible pour le moment.",
    readMore: "Lire la suite",
    minRead: "min de lecture",
    
    // Popular Articles
    mostRead: "Les plus lus",
    joinReaders: "Ne ratez aucun guide",
    receiveAnalyses: "Recevez les nouveaux articles dès leur publication.",
    subscribeToNewsletter: "S'inscrire à la newsletter",
    
    // Footer
    brandDescription: "Des guides concrets pour entreprendre avec la tech en Afrique : Mobile Money, business, dev et IA pratique.",
    navigation: "Navigation",
    information: "Informations",
    privacyPolicy: "Politique de confidentialité",
    legalNotice: "Mentions légales",
    newsletterFooter: "Newsletter",
    newsletterDescription: "Recevez nos analyses directement dans votre boîte mail.",
    allRightsReserved: "Tous droits réservés.",
    privacy: "Confidentialité",
    
    // Admin
    adminPanel: "Admin Panel",
    dashboard: "Dashboard",
    articles: "Articles",
    comments: "Commentaires",
    contacts: "Contacts",
    logout: "Déconnexion",
    expandMenu: "Étendre le menu",
    collapseMenu: "Réduire le menu",
    
    // Common
    views: "vues",
    article: "Article",
    date: "Date",
    readingTime: "Temps de lecture",
  },
  en: {
    // Header
    home: "Home",
    about: "About",
    contact: "Contact",
    newsletter: "Newsletter",
    subscribeNewsletter: "Subscribe to newsletter",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    
    // Hero/Carousel
    featured: "Featured",
    readArticle: "Read article",
    previousArticle: "Previous article",
    nextArticle: "Next article",
    goToSlide: "Go to slide",
    
    // Articles
    latestAnalyses: "Latest Analyses",
    searchArticle: "Search for an article...",
    noArticlesAvailable: "No analysis available at the moment.",
    readMore: "Read more",
    minRead: "min read",
    
    // Popular Articles
    mostRead: "Most Read",
    joinReaders: "Never miss a guide",
    receiveAnalyses: "Get new articles as soon as they come out.",
    subscribeToNewsletter: "Subscribe to newsletter",
    
    // Footer
    brandDescription: "Practical guides to building a business with tech in Africa: Mobile Money, business, dev and practical AI.",
    navigation: "Navigation",
    information: "Information",
    privacyPolicy: "Privacy Policy",
    legalNotice: "Legal Notice",
    newsletterFooter: "Newsletter",
    newsletterDescription: "Receive our analyses directly in your inbox.",
    allRightsReserved: "All rights reserved.",
    privacy: "Privacy",
    
    // Admin
    adminPanel: "Admin Panel",
    dashboard: "Dashboard",
    articles: "Articles",
    comments: "Comments",
    contacts: "Contacts",
    logout: "Logout",
    expandMenu: "Expand menu",
    collapseMenu: "Collapse menu",
    
    // Common
    views: "views",
    article: "Article",
    date: "Date",
    readingTime: "Reading time",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.fr;
