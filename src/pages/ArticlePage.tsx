import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ExternalLink, Share2 } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchArticlesByKeyword } from '../store/articlesSlice';
import { NYTArticle, formatDate, findArticleByUri } from '../services/nytApi';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { articles, currentKeyword, loading } = useAppSelector((state) => state.articles);
  const [article, setArticle] = useState<NYTArticle | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    try {
      const decodedUri = decodeURIComponent(id);
      const foundArticle = findArticleByUri(articles, decodedUri);
      
      if (foundArticle) {
        setArticle(foundArticle);
        setNotFound(false);
      } else if (currentKeyword && !loading) {
        // Jika tidak ditemukan di store dan ada keyword, re-fetch
        dispatch(fetchArticlesByKeyword({ keyword: currentKeyword, page: 0 }));
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error decoding article URI:', error);
      setNotFound(true);
    }
  }, [id, articles, currentKeyword, dispatch, loading]);

  // Re-check after re-fetch
  useEffect(() => {
    if (id && articles.length > 0 && !article) {
      try {
        const decodedUri = decodeURIComponent(id);
        const foundArticle = findArticleByUri(articles, decodedUri);
        if (foundArticle) {
          setArticle(foundArticle);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
      }
    }
  }, [articles, id, article]);

  const handleShare = async () => {
    if (article && navigator.share) {
      try {
        await navigator.share({
          title: article.headline.main,
          text: article.snippet,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="container-center py-8">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="loading-pulse h-8 w-32" />
            <div className="loading-pulse h-12 w-3/4" />
            <div className="loading-pulse h-6 w-1/2" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="loading-pulse h-4 w-full" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="content-wrapper">
        <div className="container-center py-8">
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="headline-primary mb-4">Article Not Found</h1>
            <p className="body-large text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Go Back
              </button>
              <Link to="/" className="btn-primary">
                Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="container-center py-8">
        <motion.article
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Navigation */}
          <motion.nav
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>
          </motion.nav>

          {/* Article Header */}
          <motion.header
            className="mb-8 pb-8 border-b border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Kicker */}
            {article.headline.kicker && (
              <div className="text-sm font-medium text-primary mb-2">
                {article.headline.kicker}
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {article.headline.main}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              {article.byline?.original && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.byline.original}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.pub_date)}</span>
              </div>
              {article.section_name && (
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                  {article.section_name}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {article.web_url && (
                <a
                  href={article.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Read on NYT
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={handleShare}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.header>

          {/* Article Image */}
          {article.multimedia?.default && (
            <motion.figure
              className="mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <img
                src={article.multimedia.default.url}
                alt={article.multimedia.caption || article.headline.main}
                className="w-full rounded-lg shadow-lg"
              />
              {article.multimedia.caption && (
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {article.multimedia.caption}
                  {article.multimedia.credit && (
                    <span className="block mt-1">{article.multimedia.credit}</span>
                  )}
                </figcaption>
              )}
            </motion.figure>
          )}

          {/* Article Content */}
          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {/* Abstract */}
            {article.abstract && (
              <div className="text-xl font-medium text-foreground/90 leading-relaxed mb-8 p-6 bg-muted/50 rounded-lg">
                {article.abstract}
              </div>
            )}

            {/* Lead Paragraph */}
            {article.lead_paragraph && (
              <div className="text-lg text-foreground/90 leading-relaxed mb-6">
                {article.lead_paragraph}
              </div>
            )}

            {/* Snippet as content body */}
            {article.snippet && (
              <div className="text-foreground/80 leading-relaxed mb-8">
                {article.snippet}
              </div>
            )}

            {/* Keywords */}
            {article.keywords && article.keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.slice(0, 8).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                    >
                      {keyword.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Article Footer */}
          <motion.footer
            className="mt-12 pt-8 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Published in {article.section_name}</p>
                {article.word_count && (
                  <p>{article.word_count} words</p>
                )}
              </div>
              {article.web_url && (
                <a
                  href={article.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
                >
                  Read full article on NYTimes.com →
                </a>
              )}
            </div>
          </motion.footer>
        </motion.article>
      </div>
    </div>
  );
};

export default ArticlePage;