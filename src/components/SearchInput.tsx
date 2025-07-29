import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchArticlesByKeyword, clearSearch, setKeyword } from '../store/articlesSlice';

const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentKeyword, loading } = useAppSelector((state) => state.articles);
  const [inputValue, setInputValue] = useState(currentKeyword);
  
  // Debounce input value untuk mencegah API calls yang terlalu sering
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedValue.trim() && debouncedValue !== currentKeyword) {
      dispatch(setKeyword(debouncedValue));
      dispatch(fetchArticlesByKeyword({ keyword: debouncedValue, page: 0 }));
    }
  }, [debouncedValue, dispatch, currentKeyword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(clearSearch());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(setKeyword(inputValue));
      dispatch(fetchArticlesByKeyword({ keyword: inputValue, page: 0 }));
    }
  };

  return (
    <motion.div
      className="search-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search The New York Times articles..."
            className="search-input pl-12 pr-12"
            disabled={loading}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 p-1 hover:bg-hover rounded-full transition-colors duration-150"
              disabled={loading}
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        {loading && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Searching articles...</span>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default SearchInput;