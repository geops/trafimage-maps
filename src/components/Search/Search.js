import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import {
  FaSearch,
  FaTimes,
  FaChevronCircleDown,
  FaChevronCircleUp,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import SearchToggle from './SearchToggle';
import TopicTelephoneInfos from '../TopicTelephoneInfos';

import './Search.scss';

function Search() {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const map = useSelector(state => state.app.map);
  const searchService = useSelector(state => state.app.searchService);
  const { t } = useTranslation();

  const componentIsMounted = useRef(true);
  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  useMemo(() => {
    searchService.setClear(() => setSuggestions([]));
    searchService.setUpsert(
      (section, items, position) =>
        componentIsMounted.current &&
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
      <>
        <div className="wkp-search">
          <SearchToggle>
            <Autosuggest
              multiSection
              suggestions={suggestions}
              onSuggestionsFetchRequested={event =>
                searchService.search(event.value)
              }
              onSuggestionsClearRequested={() => searchService.clear('')}
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
                          <FaChevronCircleDown focusable={false} />
                        ) : (
                          <FaChevronCircleUp focusable={false} />
                        )}
                      </div>
                    </div>
                  )
                );
              }}
              shouldRenderSuggestions={val => val.trim().length > 2}
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
                onKeyUp: e => {
                  const { key } = e;
                  if (key === 'Enter') {
                    const filtered = suggestions.filter(
                      s => s.items.length > 0,
                    );
                    if (filtered.length > 0) {
                      const { items, section } = filtered[0];
                      searchService.select({ ...items[0], section });
                    }
                  } else if (key === 'ArrowDown' || key === 'ArrowUp') {
                    searchService.highlightSection(); // for improved accessibility
                  }
                },
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
              <FaSearch focusable={false} />
            </button>
          </SearchToggle>
        </div>
        <TopicTelephoneInfos />
      </>
    )
  );
}

export default Search;
