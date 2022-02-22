/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import {
  FaSearch,
  FaTimes,
  FaChevronCircleDown,
  FaChevronCircleUp,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@material-ui/core';
import { setSearchOpen } from '../../model/app/actions';
import SearchToggle from './SearchToggle';

import './Search.scss';

// Used to show suggestions on click of the search button
let lastValue = null;
let lastSuggestions = [];

function Search() {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const map = useSelector((state) => state.app.map);
  const searchService = useSelector((state) => state.app.searchService);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!searchService) {
      return;
    }
    searchService.setClear(() => setSuggestions([]));
    searchService.setUpsert((section, items, position) =>
      setSuggestions((oldSuggestions) => {
        const index = oldSuggestions.findIndex((s) => s.section === section);
        const start = index === -1 ? position : index;
        const deleteCount = index === -1 ? 0 : 1;
        const newSuggestions = [...oldSuggestions];
        newSuggestions.splice(start, deleteCount, { section, items });
        return newSuggestions;
      }),
    );
  }, [searchService, setSuggestions]);

  useEffect(
    () => searchService && map && searchService.setMap(map),
    [searchService, map],
  );

  // Store the last list of suggestions the autocomplete component empty this list on blur.
  // We use these variables to toggle the suggestions list on click of the search button.
  useEffect(() => {
    if (value && suggestions && suggestions.length) {
      lastValue = value;
      lastSuggestions = suggestions;
    }
  }, [value, suggestions]);

  if (!searchService || !Object.keys(searchService.searches || []).length) {
    return null;
  }

  return (
    <div className="wkp-search">
      <SearchToggle>
        <Autosuggest
          multiSection
          alwaysRenderSuggestions
          suggestions={suggestions}
          onSuggestionsFetchRequested={(evt) => {
            if (evt.value && evt.value.trim().length > 2) {
              searchService.search(evt.value);
            } else {
              setSuggestions([]);
            }
          }}
          onSuggestionsClearRequested={() => searchService.clear('')}
          onSuggestionHighlighted={({ suggestion }) =>
            searchService.highlight(suggestion)
          }
          onSuggestionSelected={(e, { suggestion }) => {
            searchService.select(suggestion);
            dispatch(setSearchOpen(false));
          }}
          getSuggestionValue={(suggestion) => searchService.value(suggestion)}
          renderSuggestion={(suggestion) => searchService.render(suggestion)}
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
                  <div className="wkp-search-section-header">{t(section)}</div>
                  <div
                    className="wkp-search-section-count"
                    data-cy="wkp-search-section-title"
                  >
                    {t('overallResult', { count })}
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
          getSectionSuggestions={(result) =>
            result.items
              ? result.items.map((i) => ({ ...i, section: result.section }))
              : []
          }
          inputProps={{
            autoFocus: true,
            tabIndex: 0,
            'aria-label': 'Suche',
            onChange: (e, { newValue }) => setValue(newValue),
            onKeyUp: (e) => {
              const { key } = e;
              if (key === 'Enter') {
                const filtered = suggestions.filter((s) => s.items.length > 0);
                if (filtered.length > 0) {
                  const { items, section } = filtered[0];
                  dispatch(setSearchOpen(false));
                  searchService.select({ ...items[0], section });
                }
              } else if (key === 'ArrowDown' || key === 'ArrowUp') {
                searchService.highlightSection(); // for improved accessibility
              }
            },
            placeholder: searchService.getPlaceholder(t),
            value,
          }}
          renderInputComponent={(inputProps) => {
            return (
              <div className="wkp-search-input">
                <input {...inputProps} />
                {value && (
                  <IconButton
                    tabIndex={0}
                    aria-label={t('Suchtext löschen')}
                    className="wkp-search-button wkp-search-button-clear"
                    onClick={() => {
                      setValue('');
                      searchService.clearHighlight();
                    }}
                  >
                    <FaTimes focusable={false} />
                  </IconButton>
                )}
                <IconButton
                  tabIndex={0}
                  aria-label="Suche"
                  className="wkp-search-button wkp-search-button-submit"
                  onClick={() => {
                    if (!value) {
                      // Hide the search input on small screen
                      dispatch(setSearchOpen(false));
                    }

                    if (value && lastValue && value === lastValue) {
                      // Toggle the suggestions list visibility
                      setSuggestions(suggestions.length ? [] : lastSuggestions);
                    }
                  }}
                >
                  <FaSearch focusable={false} />
                </IconButton>
              </div>
            );
          }}
        />
      </SearchToggle>
    </div>
  );
}

export default React.memo(Search);
