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

const hidden = { visibility: 'hidden', position: 'absolute', top: -50 };
const params = new URLSearchParams(window.location.search);

function RailplusExportButton() {
  const styles = params.get('exportbtn') === 'true' ? undefined : hidden;
  return (
    <ExportButton
      style={styles}
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

export default RailplusExportButton;
