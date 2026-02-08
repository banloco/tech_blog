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
    joinReaders: "Rejoignez 2000+ lecteurs",
    receiveAnalyses: "Recevez nos meilleures analyses chaque semaine.",
    subscribeToNewsletter: "S'inscrire à la newsletter",
    
    // Footer
    brandDescription: "Décryptez l'impact de l'intelligence artificielle sur vos finances et vos investissements.",
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
    joinReaders: "Join 2000+ readers",
    receiveAnalyses: "Receive our best analyses every week.",
    subscribeToNewsletter: "Subscribe to newsletter",
    
    // Footer
    brandDescription: "Discover the impact of artificial intelligence on your finances and investments.",
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
