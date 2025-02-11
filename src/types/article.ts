export interface Article {
  id: string;
  title: string;
  description: string;
  source: string;
  author: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: string;
}

export type FilterParams = {
  query?: string;
  date?: string;
  category?: string;
  sources?: string[];
};
