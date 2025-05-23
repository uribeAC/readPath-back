import { BookStatsMongoResponse } from "../controller/types.js";
import { BookStats, BookStatsTotals } from "../types.js";
import { YearStatsDto } from "./types.js";

export const transformBookStatsMongoResponseToBookStats = (
  BookMongoStats: BookStatsMongoResponse,
): BookStats => {
  const [mongoStats] = BookMongoStats;
  const [readTotals] = mongoStats.read;
  const [pagesTotals] = mongoStats.pages;
  const [authorsTotals] = mongoStats.authors;

  const genres = mongoStats.genreStats.map((genre) => {
    return {
      genre: genre._id,
      booksTotal: genre.totals,
    };
  });

  const yearStatsDto = [...mongoStats.yearStats, ...mongoStats.yearAuthorStats];

  const statsInitialValue: Record<number, YearStatsDto> = {};

  const yearStats = yearStatsDto.reduce((accumulator, currentValue) => {
    const currentYear = currentValue._id;
    const yearFound = accumulator[currentYear] ?? {};

    accumulator[currentYear] = {
      ...yearFound,
      ...currentValue,
    };

    return accumulator;
  }, statsInitialValue);

  const booksYears = Object.entries(yearStats).map(([year, totals]) => {
    const booksYear: {
      year: number;
      totals: BookStatsTotals;
    } = {
      year: Number(year),
      totals: {
        read: totals.booksTotal,
        pages: totals.pagesTotal,
        authors: totals.totals,
      },
    };

    return booksYear;
  });

  const stats: BookStats = {
    totals: {
      read: readTotals.total,
      pages: pagesTotals.total,
      authors: authorsTotals.total,
    },
    genres: {
      total: mongoStats.genreStats.length,
      genres,
    },
    booksYear: booksYears,
  };

  return stats;
};
