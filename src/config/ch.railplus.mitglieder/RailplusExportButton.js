import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import MapButton from '../../components/MapButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import { ReactComponent as Loader } from '../../img/loader.svg';

function RailplusExportButton() {
  const { t } = useTranslation();
  return (
    <MapButton
      style={{ padding: 8, color: '#444' }}
      title={t('Grossformatiges PDF exportieren')}
    >
      <ExportButton loadingComponent={<Loader />}>
        <FaDownload />
      </ExportButton>
    </MapButton>
  );
}

export default RailplusExportButton;
