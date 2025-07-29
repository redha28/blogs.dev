import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { NYTArticle, formatDate } from '../services/nytApi';

interface ArticleCardProps {
  article: NYTArticle;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  // Extract ID dari URI untuk routing
  const articleId = encodeURIComponent(article.uri);
  
  return (
    <motion.article
      className="article-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05, // Staggered animation
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {/* Article Image */}
      {article.multimedia?.thumbnail && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={article.multimedia.thumbnail.url}
            alt={article.multimedia.caption || article.headline.main}
            className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="space-y-3">
        {/* Headline */}
        <Link to={`/article/${articleId}`}>
          <h2 className="article-card-title group-hover:text-primary transition-colors duration-150">
            {article.headline.main}
          </h2>
        </Link>

        {/* Meta Information */}
        <div className="article-meta">
          {article.byline?.original && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{article.byline.original}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(article.pub_date)}</span>
          </div>
          {article.section_name && (
            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
              {article.section_name}
            </span>
          )}
        </div>

        {/* Snippet */}
        {article.snippet && (
          <p className="article-snippet line-clamp-3">
            {article.snippet}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/article/${articleId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-150"
          >
            Read Article
          </Link>
          
          {article.web_url && (
            <a
              href={article.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <span>NYT</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;