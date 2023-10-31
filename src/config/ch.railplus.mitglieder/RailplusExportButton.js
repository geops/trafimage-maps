import React from 'react';
import { PropTypes } from 'prop-types';
import { BsDownload } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import MapButton from '../../components/MapButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import { ReactComponent as Loader } from '../../img/loader.svg';
import { RAILPLUS_EXPORTBTN_ID } from '../../utils/constants';

const BtnCmpt = ({ children, title }) => {
  const { t } = useTranslation();
  return (
    <MapButton style={{ padding: 8, color: '#444' }} title={t(title)}>
      {children}
    </MapButton>
  );
};

BtnCmpt.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

BtnCmpt.defaultProps = {
  children: <BsDownload />,
  title: 'Grossformatiges PDF exportieren',
};

const params = new URLSearchParams(window.location.search);

function RailplusExportButton() {
  return (
    <ExportButton
      style={params.get('exportbtn') !== 'true' ? { display: 'none' } : {}}
      id={RAILPLUS_EXPORTBTN_ID}
      loadingComponent={
        <BtnCmpt>
          <Loader />
        </BtnCmpt>
      }
    >
      <BtnCmpt />
    </ExportButton>
  );
}

export default React.memo(RailplusExportButton);
