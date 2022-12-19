import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import TarifverbundPartner from '../../components/TarifverbundPartner';
import useFetch from '../../utils/useFetch';

const useStyles = makeStyles(() => {
  return {
    legend: {
      display: 'grid',
      gridTemplateColumns: (props) =>
        props.isMobile ? '1fr 1fr' : '200px 200px',
      gap: 5,
    },
  };
});

function TarifVerbundLegend() {
  const { t } = useTranslation();
  const vectorTilesUrl = useSelector((state) => state.app.vectorTilesUrl);
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  const classes = useStyles({ isMobile });
  const { data: style, loading } = useFetch(
    `${vectorTilesUrl}/styles/ch.sbb.tarifverbund/style.json`,
  );
  const verbunde = useMemo(() => {
    return style?.metadata?.partners?.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [style]);

  return (
    <div>
      <div className={classes.legend}>
        {loading ? `${t('Wird geladen')}...` : null}
        {!loading && (verbunde || []).length ? (
          <>
            {verbunde.map((v) => (
              <TarifverbundPartner
                key={v.name}
                color={`#${v.verbund_colour_hex}`}
                label={v.name}
              />
            ))}
            <TarifverbundPartner
              style={{
                background:
                  'repeating-linear-gradient(45deg, transparent, transparent 2px, #bd9189 2px, #bd9189 4px)',
              }}
              label="Z-Pass"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default TarifVerbundLegend;
