import axios from 'axios';
import { Article, FilterParams } from '../types/article';

const API_KEY = '9de582af10e04c35a5f2059328b2c121';

export const fetchNewsApiArticles = async (
  params: FilterParams
): Promise<Article[]> => {
  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      apiKey: API_KEY,
      q: params?.query || (params.category || 'all'),
      from: params.date ? params.date : undefined,
      sources: params.sources?.join(','),
    },
  });

  return response.data.articles.map((article: any) => ({
    id: article.url,
    title: article.title,
    description: article.description,
    source: 'NewsAPI',
    author: article.author || 'Unknown',
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: new Date(article.publishedAt).toISOString(),
    category: params.category || 'general',
  }));
};
