import { Article } from '../types/article';
export const ArticleCard = ({ article }: { article: Article }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {article.imageUrl && (
      <img 
        src={article.imageUrl} 
        alt={article.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
    )}
    <div className="p-4">
      <div className="text-sm text-gray-500 mb-2">
        <span>{article.source}</span> •{' '}
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
      <h3 className="font-bold text-lg mb-2">{article.title}</h3>
      <p className="text-gray-600 line-clamp-3">{article.description}</p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
      >
        Read more →
      </a>
    </div>
  </div>
);
