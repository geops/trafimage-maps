import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLink } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { Popover, IconButton, makeStyles } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
  content: {
    maxWidth: 300,
    paddingRight: 42,

    '& > p:first-child': {
      marginTop: 0,
    },

    '& > p:last-child': {
      marginBottom: 0,
    },
  },
}));

function PermalinkButton({ buttonProps, children, popoverProps }) {
  const classes = useStyles();

  const { t } = useTranslation();
  const ref = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const transformOrigin = {
    vertical: 'center',
    horizontal: 'left',
    ...(popoverProps.transformOrigin || {}),
  };

  const arrowClassName = `wkp-arrow-${transformOrigin.vertical}-${transformOrigin.horizontal}`;

  return (
    <div className="wkp-permalink-bt" ref={ref}>
      {/* ToggleButton is used to set a color when the svg is selected */}
      <ToggleButton
        value=""
        component="div"
        selected={!!anchorEl}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...buttonProps}
      >
        <IconButton
          title={t('Permalink generieren')}
          onClick={handleClick}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...buttonProps}
        >
          <FaLink focusable={false} />
        </IconButton>
      </ToggleButton>
      <Popover
        container={ref.current}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={transformOrigin}
        elvation
      >
        <div className={arrowClassName} />
        <IconButton className="wkp-close" onClick={handleClose}>
          <AiOutlineCloseCircle focusable={false} />
        </IconButton>
        <div className={classes.content}>{children}</div>
      </Popover>
    </div>
  );
}

PermalinkButton.propTypes = {
  buttonProps: PropTypes.object,
  popoverProps: PropTypes.object,
  children: PropTypes.arrayOf(PropTypes.element),
};

PermalinkButton.defaultProps = {
  buttonProps: {},
  popoverProps: {},
  children: null,
};

export default React.memo(PermalinkButton);
