import React, { useState } from "react";
import { api } from "../utils/api";

type Suggestion = string;

interface Props {
  suggestions: Suggestion[];
}

const SearchBox: React.FC<Props> = ({ suggestions: initialSuggestions }) => {
  const [query, setQuery] = useState("");
  const [displayedSuggestions, setDisplayedSuggestions] =
    useState<Suggestion[]>(initialSuggestions);

  // Fetch suggestions based on the current query
  const search = api.search.suggestion.useQuery({
    searchText: query,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFeelingLucky = () => {
    // Select a random suggestion
    const randomIndex = Math.floor(Math.random() * displayedSuggestions.length);
    const randomSuggestion = displayedSuggestions[randomIndex];
    // Use the selected suggestion
    // ... TODO: build a search api
  };

  const handleSearch = () => {
    // Perform a search based on the current query
    // ... TODO: build a search api
  };

  React.useEffect(() => {
    if (query.length >= 1 && search.data) {
      setDisplayedSuggestions(search.data.suggestions);
    } else if (query.length === 0) {
      setDisplayedSuggestions(initialSuggestions);
    }
  }, [query, search.data, initialSuggestions]);

  return (
    <div className="relative">
      <div className="flex items-center rounded-t-lg border border-gray-300 bg-white px-4">
        <span className="text-gray-500">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          className="focus:shadow-outline border- block w-full appearance-none rounded-t-lg border-gray-300 bg-white py-2 px-4 leading-normal focus:outline-none"
        />
      </div>
      <div className="absolute z-10 w-full rounded-b-lg bg-white">
        <ul className="list-reset">
          {displayedSuggestions.length > 0 &&
            displayedSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="p-2 text-gray-500 hover:bg-gray-200"
              >
                {suggestion}
              </li>
            ))}
          <li className="mx-2 flex justify-evenly py-1">
            <button
              className="border-box block justify-center rounded-lg border-2 border-white px-2 text-center font-medium leading-relaxed text-gray-700 hover:border-gray-300 disabled:text-gray-400"
              onClick={handleSearch}
              disabled={query.length === 0}
            >
              Search
            </button>
            <button
              className="border-box block justify-center rounded-lg border-2 border-white px-2 text-center font-medium leading-relaxed text-gray-700 hover:border-gray-300 disabled:text-gray-400"
              onClick={handleFeelingLucky}
            >
              Feeling Lucky
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SearchBox;
