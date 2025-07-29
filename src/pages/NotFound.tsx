import React, { useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="content-wrapper">
      <div className="container-center">
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="text-4xl font-bold text-muted-foreground">404</span>
          </motion.div>
          
          <h1 className="headline-primary mb-4">Page Not Found</h1>
          <p className="body-large text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Articles
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
