import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaInfoCircle } from 'react-icons/fa';
import Button from '@geops/react-ui/components/Button';
import { setSelectedForInfos } from '../../model/app/actions';

function InfosButton({ selectedInfo, className }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedForInfos = useSelector((state) => state.app.selectedForInfos);

  const isSelected = useMemo(() => {
    return selectedForInfos === selectedInfo;
  }, [selectedForInfos, selectedInfo]);

  const classNam = useMemo(() => {
    const classes = [className];

    if (isSelected) {
      classes.push('wkp-selected');
    }
    return classes.join(' ');
  }, [className, isSelected]);

  return (
    <Button
      className={classNam}
      title={t('Layerinformationen anzeigen', { layer: t(selectedInfo.key) })}
      onClick={() => {
        console.log('isSelected', isSelected);
        dispatch(setSelectedForInfos(isSelected ? null : selectedInfo));
      }}
    >
      <FaInfoCircle focusable={false} />
    </Button>
  );
}

InfosButton.propTypes = {
  // A topic or a layer
  selectedInfo: PropTypes.object.isRequired,
  className: PropTypes.string,
};

InfosButton.defaultProps = {
  className: 'wkp-info-bt',
};

export default React.memo(InfosButton);
