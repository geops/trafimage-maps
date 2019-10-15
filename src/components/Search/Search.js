import React, { useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import SearchService from './SearchService';
import SearchToggle from './SearchToggle';

import './Search.scss';

function Search() {
  const dispatch = useDispatch();
  const activeTopic = useSelector(state => state.app.activeTopic);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  const searchService = useMemo(() => {
    const clear = () => setSuggestions([]);
    const upsert = (section, items) =>
      setSuggestions(oldSuggestions => {
        const index = oldSuggestions.findIndex(s => s.section === section);
        const newSuggestions = [...oldSuggestions];
        if (index === -1) {
          newSuggestions.push({ section, items });
        } else {
          newSuggestions[index] = { section, items };
        }
        return newSuggestions;
      });
    return new SearchService(activeTopic, clear, upsert, dispatch);
  }, [activeTopic, setSuggestions, dispatch]);

  return (
    Object.keys(activeTopic.searches).length > 0 && (
      <div className="wkp-search">
        <SearchToggle>
          <Autosuggest
            multiSection
            suggestions={suggestions}
            onSuggestionsFetchRequested={event =>
              searchService.search(event.value)
            }
            onSuggestionsClearRequested={() => searchService.clear()}
            onSuggestionSelected={(e, { suggestion }) =>
              searchService.select(suggestion)
            }
            getSuggestionValue={suggestion => searchService.value(suggestion)}
            renderSuggestion={suggestion => searchService.render(suggestion)}
            renderSectionTitle={result => t(result.section)}
            getSectionSuggestions={result =>
              result.items
                ? result.items.map(i => ({ ...i, section: result.section }))
                : []
            }
            inputProps={{
              autofocus: 'true',
              onChange: (e, { newValue }) => setValue(newValue),
              placeholder: searchService.getPlaceholder(t),
              value,
            }}
          />
          <button type="button" className="wkp-search-button">
            <FaSearch />
          </button>
        </SearchToggle>
      </div>
    )
  );
}

export default Search;
