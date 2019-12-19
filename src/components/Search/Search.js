import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import RTSearch from 'react-transit/components/Search';

import SearchToggle from './SearchToggle';

import 'react-transit/components/Search/Search.scss';

const propTypes = {
  apiKey: PropTypes.string.isRequired,
};

function Search({ apiKey }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { layerService, map, searchEngines } = useSelector(state => ({
    layerService: state.app.layerService,
    map: state.app.map,
    searchEngines: state.app.activeTopic.searchEngines,
  }));

  useMemo(() => {
    const props = { layerService, dispatch, t };
    Object.values(searchEngines).forEach(engine => engine.setProps(props));
  }, [dispatch, layerService, searchEngines, t]);

  const highlight = useMemo(() => {
    let highlightFeature;
    return (item, persistent = false) => {
      const highlightLayer = new OLVectorLayer({
        source: new OLVectorSource({}),
      });
      highlightLayer.setMap(map);
      const featureProjection = map.getView().getProjection();
      const feature = item
        ? searchEngines[item.section].getFeature(item, { featureProjection })
        : highlightFeature;

      if (feature) {
        highlightLayer.getSource().addFeature(feature);

        if (persistent) {
          highlightFeature = feature;
          map.getView().fit(highlightLayer.getSource().getExtent(), {
            padding: [50, 50, 50, 50],
            maxZoom: 15,
            callback: () => searchEngines[item.section].openPopup(item),
          });
        }
      }
    };
  }, [map, searchEngines]);

  return (
    <SearchToggle>
      <RTSearch
        apiKey={apiKey}
        engines={searchEngines}
        inputProps={{
          'aria-label': t('Suche'),
          placeholder: `${Object.entries(searchEngines)
            .filter(([, search]) => search.showInPlaceholder)
            .map(([section, search]) => t(search.placeholder || section))
            .join(', ')} …`,
        }}
        getRenderSectionTitle={searchService => ({ section }) => {
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
                <div className="wkp-search-section-count">
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
        onHighlight={suggestion => highlight(suggestion)}
        onSelect={suggestion => highlight(suggestion, true)}
      />
    </SearchToggle>
  );
}

Search.propTypes = propTypes;

export default Search;
