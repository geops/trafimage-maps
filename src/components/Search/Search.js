import React, { useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import {
  FaSearch,
  FaChevronCircleDown,
  FaChevronCircleUp,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import SearchToggle from './SearchToggle';

import './Search.scss';

function Search({ map, searchService }) {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  useMemo(() => {
    searchService.setClear(() => setSuggestions([]));
    searchService.setUpsert((section, items) =>
      setSuggestions(oldSuggestions => {
        const index = oldSuggestions.findIndex(s => s.section === section);
        const newSuggestions = [...oldSuggestions];
        if (index === -1 && items) {
          newSuggestions.push({ section, items });
        } else if (items) {
          newSuggestions[index] = { section, items };
        }
        return newSuggestions;
      }),
    );
  }, [searchService, setSuggestions]);

  useMemo(() => searchService.setMap(map), [searchService, map]);

  return (
    Object.keys(searchService.searches).length > 0 && (
      <div className="wkp-search">
        <SearchToggle>
          <Autosuggest
            multiSection
            suggestions={suggestions}
            onSuggestionsFetchRequested={event =>
              searchService.search(event.value)
            }
            onSuggestionsClearRequested={() => searchService.clear()}
            onSuggestionHighlighted={({ suggestion }) =>
              searchService.highlight(suggestion)
            }
            onSuggestionSelected={(e, { suggestion }) =>
              searchService.select(suggestion)
            }
            getSuggestionValue={suggestion => searchService.value(suggestion)}
            renderSuggestion={suggestion => searchService.render(suggestion)}
            renderSectionTitle={result => {
              const count = searchService.countItems(result.section);
              return (
                <div
                  onClick={() => searchService.toggleSection(result.section)}
                  onKeyPress={() => searchService.toggleSection(result.section)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="wkp-search-section-header">
                    {t(result.section)}
                  </div>
                  <div className="wkp-search-section-count">
                    {count > 0 ? (
                      <>
                        {t('insgesamt {{ count }} Ergebnisse', { count })}
                        {searchService.sectionCollapsed(result.section) ? (
                          <FaChevronCircleDown />
                        ) : (
                          <FaChevronCircleUp />
                        )}
                      </>
                    ) : (
                      t('keine Ergebnisse')
                    )}
                  </div>
                </div>
              );
            }}
            getSectionSuggestions={result =>
              result.items
                ? result.items.map(i => ({ ...i, section: result.section }))
                : []
            }
            inputProps={{
              autoFocus: true,
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
