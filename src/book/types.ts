export interface BookStructure {
  _id: string;
  title: string;
  author: string;
  saga?: {
    name: string;
    bookNumber: number;
  };
  description: string;
  genres: string[];
  pages: number;
  firstPublished: Date;
  state: "read" | "to read";
  yourRating?: Rating;
  readDates?: {
    dateStarted?: Date;
    dateFinished?: Date;
    readYear?: number;
  };
  coverImageUrlSmall: string;
  coverImageUrlBig: string;
  imageAlt: string;
}

type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export type BookData = Omit<
  BookStructure,
  "_id" | "firstPublished" | "readDates"
> & {
  firstPublished: string;
  readDates?: {
    dateStarted?: string;
    dateFinished?: string;
    readYear?: number;
  };
};

export interface ResponseBodyError {
  error: string;
}

export interface BookStats {
  totals: BookStatsTotals;
  genres: {
    total: number;
    genres: {
      genre: string;
      booksTotal: number;
    }[];
  };
  booksYear: {
    year: number;
    totals: BookStatsTotals;
  }[];
}

export type BookStatsTotals = {
  read: number;
  pages: number;
  authors: number;
};
