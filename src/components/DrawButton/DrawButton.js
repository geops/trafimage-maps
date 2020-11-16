import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RiPencilFill } from 'react-icons/ri';
import IconButton from '@material-ui/core/IconButton';

function DrawButton({ children, ...buttonProps }) {
  const mapsetUrl = useSelector((state) => state.app.mapsetUrl);
  const { t } = useTranslation();

  return (
    <IconButton
      href={`${mapsetUrl}?parent=${encodeURIComponent(window.location)}`}
      target="blank_"
      title={t('Zeichnen')}
      size="medium"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    >
      {children || <RiPencilFill focusable={false} />}
    </IconButton>
  );
}

DrawButton.propTypes = {
  children: PropTypes.element,
};

DrawButton.defaultProps = {
  children: null,
};

export default React.memo(DrawButton);
