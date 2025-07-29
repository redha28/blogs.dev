import axios from "axios";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

// Interface berdasarkan response API NYT yang diberikan
export interface NYTArticle {
  _id: string;
  abstract: string;
  byline: {
    original: string;
  };
  document_type: string;
  headline: {
    main: string;
    kicker: string;
    print_headline: string;
  };
  keywords: Array<{
    name: string;
    value: string;
    rank: number;
  }>;
  multimedia?: {
    caption: string;
    credit: string;
    default: {
      url: string;
      height: number;
      width: number;
    };
    thumbnail: {
      url: string;
      height: number;
      width: number;
    };
  };
  news_desk: string;
  pub_date: string;
  section_name: string;
  snippet: string;
  source: string;
  subsection_name: string;
  type_of_material: string;
  uri: string;
  web_url: string;
  word_count: number;
  lead_paragraph?: string;
}

export interface NYTSearchResponse {
  status: string;
  copyright: string;
  response: {
    docs: NYTArticle[];
    metadata: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

export const searchArticles = async (query: string, page = 0): Promise<NYTSearchResponse> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        page,
        "api-key": API_KEY,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid API key.");
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. Please check your connection.");
      }
    }
    throw new Error("Failed to fetch articles. Please try again.");
  }
};

// Helper function untuk format tanggal
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function untuk extract artikel berdasarkan URI
export const findArticleByUri = (articles: NYTArticle[], uri: string): NYTArticle | undefined => {
  return articles.find((article) => article.uri === uri);
};
