import axios from 'axios';
import { Article, FilterParams } from '../types/article';

const API_KEY = '4b6fa6e9-6ade-48c4-8e91-c9fc389090b2';

export const fetchGuardianArticles = async (
  params: FilterParams
): Promise<Article[]> => {
  const response = await axios.get('https://content.guardianapis.com/search', {
    params: {
      'api-key': API_KEY,
      q: params.query,
      'from-date': params.date ? params.date : undefined,
      section: params.category,
      pageSize: 50,
    },
  });

  return response.data.response.results.map((article: any) => ({
    id: article.id,
    title: article.webTitle,
    description: article.fields?.trailText || '',
    source: 'The Guardian',
    author: '',
    url: article.webUrl,
    imageUrl: article.fields?.thumbnail,
    publishedAt: new Date(article.webPublicationDate).toISOString(),
    category: article.sectionId || 'general',
  }));
};
