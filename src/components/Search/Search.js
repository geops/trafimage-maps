import React, { useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import {
  FaSearch,
  FaTimes,
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
    searchService.setUpsert((section, items, position) =>
      setSuggestions(oldSuggestions => {
        const index = oldSuggestions.findIndex(s => s.section === section);
        const start = index === -1 ? position : index;
        const deleteCount = index === -1 ? 0 : 1;
        const newSuggestions = [...oldSuggestions];
        newSuggestions.splice(start, deleteCount, { section, items });
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
            onSuggestionsClearRequested={() => searchService.clear('asdf')}
            onSuggestionHighlighted={({ suggestion }) =>
              searchService.highlight(suggestion)
            }
            onSuggestionSelected={(e, { suggestion }) =>
              searchService.select(suggestion)
            }
            getSuggestionValue={suggestion => searchService.value(suggestion)}
            renderSuggestion={suggestion => searchService.render(suggestion)}
            renderSectionTitle={({ section }) => {
              const count = searchService.countItems(section);
              return (
                count > 0 && (
                  <div
                    onClick={() => searchService.toggleSection(section)}
                    onKeyPress={() => searchService.toggleSection(section)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="wkp-search-section-header">
                      {t(section)}
                    </div>
                    <div className="wkp-search-section-count">
                      {t('insgesamt {{ count }} Ergebnisse', { count })}
                      {searchService.sectionCollapsed(section) ? (
                        <FaChevronCircleDown />
                      ) : (
                        <FaChevronCircleUp />
                      )}
                    </div>
                  </div>
                )
              );
            }}
            getSectionSuggestions={result =>
              result.items
                ? result.items.map(i => ({ ...i, section: result.section }))
                : []
            }
            inputProps={{
              autoFocus: true,
              tabIndex: 0,
              'aria-label': 'Suche',
              onChange: (e, { newValue }) => setValue(newValue),
              placeholder: searchService.getPlaceholder(t),
              value,
            }}
          />
          {value && (
            <button
              type="button"
              tabIndex={0}
              aria-label={t('Suchtext löschen')}
              className="wkp-search-button wkp-search-button-clear"
              onClick={() => {
                setValue('');
                searchService.clearHighlight();
              }}
            >
              <FaTimes />
            </button>
          )}
          <button
            type="button"
            tabIndex={0}
            aria-label={t('Suche')}
            className="wkp-search-button wkp-search-button-submit"
          >
            <FaSearch />
          </button>
        </SearchToggle>
      </div>
    )
  );
}

export default Search;
