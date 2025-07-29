import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { Search, AlertCircle } from "lucide-react";
import ArticleCard from "./ArticleCard";
import { fetchLatestArticles, fetchArticlesByKeyword, setPage } from "../store/articlesSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const ArticleList: React.FC = () => {
  const {
    articles,
    loading,
    error,
    hasSearched,
    currentKeyword,
    metadata,
    currentPage,
    isInitialLoad,
  } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();

  // Load initial articles when component mounts
  useEffect(() => {
    if (isInitialLoad) {
      dispatch(fetchLatestArticles(0));
    }
  }, [dispatch, isInitialLoad]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    if (currentKeyword && currentKeyword !== "Latest News") {
      dispatch(fetchArticlesByKeyword({ keyword: currentKeyword, page }));
    } else {
      dispatch(fetchLatestArticles(page));
    }
  };

  // Calculate pagination info
  const articlesPerPage = 10; // NYT API returns 10 articles per page
  const totalPages = metadata ? Math.ceil(metadata.hits / articlesPerPage) : 0;
  const maxPagesToShow = 5;

  // Loading state
  if (loading) {
    return (
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="article-card">
            <div className="space-y-3">
              <div className="loading-pulse h-6 w-3/4" />
              <div className="loading-pulse h-4 w-1/2" />
              <div className="loading-pulse h-16 w-full" />
              <div className="flex gap-2">
                <div className="loading-pulse h-4 w-20" />
                <div className="loading-pulse h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 text-destructive rounded-full mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="headline-secondary mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-secondary">
          Try Again
        </button>
      </motion.div>
    );
  }

  // Empty state - only show when no search is performed and not loading
  if (!hasSearched && !loading) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="headline-secondary mb-3">Search The New York Times</h2>
        <p className="body-large text-muted-foreground max-w-md mx-auto">
          Enter a keyword or phrase to search through thousands of NYT articles and discover the
          stories that matter.
        </p>
      </motion.div>
    );
  }

  // No results found
  if (hasSearched && articles.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="headline-secondary mb-2">Not Found</h3>
        <p className="text-muted-foreground mb-4">
          No articles found for "{currentKeyword}". Try different keywords or check your spelling.
        </p>
        <div className="text-sm text-muted-foreground">
          Search tips: Use specific keywords, try different spellings, or search for broader topics.
        </div>
      </motion.div>
    );
  }

  // Results found
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Results header */}
      <motion.div
        className="mb-8 pb-4 border-b border-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}>
        <h2 className="headline-secondary mb-2">
          {currentKeyword === "Latest News"
            ? "Latest News"
            : `Search Results for "${currentKeyword}"`}
        </h2>
        {metadata && (
          <p className="text-muted-foreground">
            Found {metadata.hits.toLocaleString()} articles • Page {currentPage + 1} of{" "}
            {Math.min(totalPages, 100)} • Showing {articles.length} results
          </p>
        )}
      </motion.div>

      {/* Articles grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard key={article._id} article={article} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {metadata && totalPages > 1 && (
        <motion.div
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          <Pagination>
            <PaginationContent>
              {/* Previous button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: Math.min(maxPagesToShow, totalPages) }, (_, i) => {
                const startPage = Math.max(
                  0,
                  Math.min(
                    currentPage - Math.floor(maxPagesToShow / 2),
                    totalPages - maxPagesToShow
                  )
                );
                const pageNumber = startPage + i;

                if (pageNumber >= totalPages || pageNumber >= 100) return null; // NYT API limit

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={pageNumber === currentPage}
                      className="cursor-pointer">
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Next button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages - 1 &&
                    currentPage < 99 &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage >= totalPages - 1 || currentPage >= 99
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Page {currentPage + 1} of {Math.min(totalPages, 100)} • {metadata.hits.toLocaleString()}{" "}
            total articles
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ArticleList;
