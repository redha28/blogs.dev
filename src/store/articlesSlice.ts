import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchArticles, NYTArticle, NYTSearchResponse } from '../services/nytApi';

// Async thunk untuk mencari artikel berdasarkan keyword
export const fetchArticlesByKeyword = createAsyncThunk(
  'articles/fetchByKeyword',
  async ({ keyword, page = 0 }: { keyword: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await searchArticles(keyword, page);
      return { ...response, page, keyword };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles');
    }
  }
);

// Async thunk untuk fetch artikel populer/latest (default search)
export const fetchLatestArticles = createAsyncThunk(
  'articles/fetchLatest',
  async (page: number = 0, { rejectWithValue }) => {
    try {
      const response = await searchArticles('news', page);
      return { ...response, page, keyword: 'Latest News' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles');
    }
  }
);

interface ArticlesState {
  articles: NYTArticle[];
  currentKeyword: string;
  currentPage: number;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  isInitialLoad: boolean;
  metadata: {
    hits: number;
    offset: number;
    time: number;
  } | null;
}

const initialState: ArticlesState = {
  articles: [],
  currentKeyword: '',
  currentPage: 0,
  loading: false,
  error: null,
  hasSearched: false,
  isInitialLoad: true,
  metadata: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.articles = [];
      state.currentKeyword = '';
      state.currentPage = 0;
      state.error = null;
      state.hasSearched = false;
      state.metadata = null;
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.currentKeyword = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticlesByKeyword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.response.docs;
        state.metadata = action.payload.response.metadata;
        state.currentKeyword = action.payload.keyword;
        state.currentPage = action.payload.page;
        state.hasSearched = true;
        state.isInitialLoad = false;
        state.error = null;
      })
      .addCase(fetchArticlesByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasSearched = true;
        state.isInitialLoad = false;
        state.articles = [];
        state.metadata = null;
      })
      .addCase(fetchLatestArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.response.docs;
        state.metadata = action.payload.response.metadata;
        state.currentKeyword = action.payload.keyword;
        state.currentPage = action.payload.page;
        state.hasSearched = true;
        state.isInitialLoad = false;
        state.error = null;
      })
      .addCase(fetchLatestArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasSearched = true;
        state.isInitialLoad = false;
        state.articles = [];
        state.metadata = null;
      });
  },
});

export const { clearSearch, setKeyword, setPage } = articlesSlice.actions;
export default articlesSlice.reducer;