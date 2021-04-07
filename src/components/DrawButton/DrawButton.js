import { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
// import { Pencil } from '../../img';
import { ReactComponent as Pencil } from '../../img/pencil.svg';

function DrawButton({ children, ...buttonProps }) {
  const mapsetUrl = useSelector((state) => state.app.mapsetUrl);
  const { t } = useTranslation();

  return (
    <IconButton
      title={t('Neue Zeichnung')}
      size="medium"
      /* We use a function instead of href to be able to get the proper window.location value. */
      onClick={() => {
        // window.open is esaier to test.
        window.open(
          `${mapsetUrl}?parent=${encodeURIComponent(window.location)}`,
          '_self',
        );
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    >
      {children || <Pencil focusable={false} />}
    </IconButton>
  );
}

DrawButton.propTypes = {
  children: PropTypes.element,
};

DrawButton.defaultProps = {
  children: null,
};

export default memo(DrawButton);
