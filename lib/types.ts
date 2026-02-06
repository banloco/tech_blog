export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  tags: string[];
  status: "draft" | "published";
  meta_title?: string;
  meta_description?: string;
  views_count?: number;
  likes_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email: string;
  content: string;
  likes_count?: number;
  is_approved: boolean;
  is_reported?: boolean;
  created_at: string;
  post?: { title: string; slug: string };
  replies?: Comment[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
