import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

interface QueryData {
  id: number;
  query: string;
  queryTime: string;
  itemRank: number;
  clickURL: string;
}

const hardSuggestions = [
  "why is my cat looking at me like that?",
  "does my cat want to kill me?",
  "how do I appease my cat?",
  "are babies dishwasher safe?",
  "am I a vampire?",
];

const parseData = (data: string): QueryData[] => {
  const lines = data.split("\n") ?? [];
  if (lines && lines.length === 0) {
    return [];
  }

  // get the properties list from the first line of the file
  const properties = lines[0]?.split("\t") ?? [];
  // result: const properties = ["AnonID", "Query", "QueryTime", "ItemRank", "ClickURL"];

  // slice to remove the first line with the header information
  return lines.slice(1).map((line) => {
    const values = line.split("\t");
    return values.reduce((aggregator, value, index) => {
      const currentProperty =
        index <= properties.length ? properties[index] : "";
      switch (currentProperty) {
        case "AnonID":
          aggregator.id = parseInt(value);
          break;
        case "ItemRank":
          aggregator.itemRank = value ? parseInt(value) : 0;
          break;
        case "Query":
          aggregator.query = value;
          break;
        case "QueryTime":
          aggregator.queryTime = value;
          break;
        case "ItemRank":
          aggregator.queryTime = value;
          break;
        case "ClickURL":
          aggregator.clickURL = value;
          break;
      }
      return aggregator;
    }, {} as QueryData);
  });
};

export const searchRouter = createTRPCRouter({
  suggestion: publicProcedure
    .input(z.object({ searchText: z.string() }))
    .query(({ input }) => {
      return {
        suggestions: input.searchText
          ? hardSuggestions.filter((suggestion) =>
              suggestion.startsWith(input.searchText)
            )
          : hardSuggestions,
      };
    }),
  default: publicProcedure.query(() => {
    const randomSuggestion =
      hardSuggestions[Math.floor(Math.random() * hardSuggestions.length)] ??
      "why is my cat looking at me like that?";
    return {
      // some inspiration from: https://www.jellyfish.com/en-us/news-insights/the-top-10-weirdest-google-auto-completes-weve-found-during-keyword-research
      // get a random first index for the default suggestion
      suggestions: [randomSuggestion],
    };
  }),
});
