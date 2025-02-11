import axios from 'axios';
import { Article, FilterParams } from '../types/article';

const API_KEY = 'j4Bxfe15sAJA6p9TZUjZCCmBSU2PCNlt';

export const fetchNYTArticles = async (
  params: FilterParams
): Promise<Article[]> => {
  const response = await axios.get(
    'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    {
      params: {
        'api-key': API_KEY,
        q: params.query,
        begin_date: params.date ? params.date.replace(/-/g, '') : undefined,
        fq: params.category ? params.category : '',
      },
    }
  );

  return response.data.response.docs.map((article: any) => ({
    id: article._id,
    title: article.headline.main,
    description: article.abstract,
    source: 'New York Times',
    author:
      article.byline?.original?.replace('By ', '') || 'Unknown',
    url: article.web_url,
    imageUrl: article.multimedia?.[0]?.url
      ? `https://www.nytimes.com/${article.multimedia[0].url}`
      : undefined,
    publishedAt: new Date(article.pub_date).toISOString(),
    category: article.section_name || 'general',
  }));
};
