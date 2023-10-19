import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import MapButton from '../../components/MapButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import { ReactComponent as Loader } from '../../img/loader.svg';

const styles = { padding: 8, color: '#444' };

function RailplusExportButton() {
  const { t } = useTranslation();
  return (
    <ExportButton
      loadingComponent={
        <MapButton style={styles}>
          <Loader />
        </MapButton>
      }
    >
      <MapButton style={styles} title={t('Grossformatiges PDF exportieren')}>
        <FaDownload />
      </MapButton>
    </ExportButton>
  );
}

export default RailplusExportButton;
