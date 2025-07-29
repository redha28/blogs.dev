import React from 'react';
import { motion } from 'framer-motion';
import SearchInput from '../components/SearchInput';
import ArticleList from '../components/ArticleList';

const HomePage: React.FC = () => {
  return (
    <div className="content-wrapper">
      <div className="container-center py-8">
        {/* Header */}
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="headline-primary mb-4">
            NYT Chronicle
          </h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            Search and discover articles from The New York Times. 
            Stay informed with quality journalism and in-depth reporting.
          </p>
        </motion.header>

        {/* Search Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SearchInput />
        </motion.section>

        {/* Results Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ArticleList />
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;