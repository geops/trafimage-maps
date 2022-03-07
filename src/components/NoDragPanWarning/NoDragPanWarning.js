import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { unByKey } from 'ol/Observable';
import DragPan from 'ol/interaction/DragPan';
import { ReactComponent as NoDragPanWarningIcon } from '../../img/sbb/two-finger-tap-large.svg';

const useStyles = makeStyles(() => ({
  '@keyframes show': {
    from: { opacity: 0 },
    to: { opcaity: 1 },
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 'calc(100% - 100px)',
    height: 'calc(100% - 100px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white !important',
    flexDirection: 'column',
    padding: 50,
    zIndex: 9999,
    animation: '$show .5s',
  },
  icon: {
    background: 'white',
    borderRadius: '50%',
    width: '52px',
    height: '52px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',

    '& svg': {
      width: '70%',

      '& path': {
        stroke: '#767676',
      },
    },
  },
  text: {
    fontSize: '1.3em',
  },
}));

function NoDragPanWarning() {
  const map = useSelector((state) => state.app.map);
  const embedded = useSelector((state) => state.app.embedded);
  const { t } = useTranslation();
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const onChangeTargetRef = map.on('change:target', () => {
      setTarget(map.getViewport());
    });
    return () => {
      unByKey(onChangeTargetRef);
    };
  }, [map]);

  useEffect(() => {
    let onPointerDownRef;
    let onPointerDragRef;
    let oncePointerUpRef;
    let oncePointerCancelRef;
    let onPointerCancel;
    let onTouchEnd;

    if (embedded && map && target) {
      // We allow default scroll behavior for touch events.
      map.getViewport().style.touchAction = 'pan-x pan-y';

      const dragPan = map
        .getInteractions()
        .getArray()
        .find((interaction) => interaction instanceof DragPan);
      onPointerDownRef = map.on('pointerdown', (evt) => {
        let isCancelled = false;
        target.removeEventListener('touchend', onTouchEnd);
        target.removeEventListener('pointercancel', onPointerCancel);

        if (
          evt.originalEvent.pointerType !== 'touch' ||
          // eslint-disable-next-line no-underscore-dangle
          !dragPan.condition_(evt)
        ) {
          return true;
        }

        // Show the warning on next pointerdrag events.
        onPointerDragRef = map.on('pointerdrag', () => {
          if (dragPan.targetPointers.length !== 1) {
            return true;
          }

          setShow(true);
          return false;
        });

        // When touch-action css is set to 'pan-x pan-y', the map pointer events are cancelled.
        // In that case we use the touchend event to hide the warning.
        onPointerCancel = () => {
          isCancelled = true;
          onTouchEnd = () => {
            unByKey(onPointerDragRef);
            setShow(false);
            target.removeEventListener('touchend', onTouchEnd);
          };
          target.addEventListener('touchend', onTouchEnd);
        };
        target.addEventListener('pointercancel', onPointerCancel);

        // Use pointerup to hide the warning if the pointer event is not cancelled before.
        oncePointerUpRef = map.once('pointerup', () => {
          if (isCancelled) {
            // let touchend event handle the warning
            return;
          }
          unByKey(onPointerDragRef);
          setShow(false);
        });

        return true;
      });
    }

    return () => {
      unByKey([
        onPointerDownRef,
        onPointerDragRef,
        oncePointerUpRef,
        oncePointerCancelRef,
      ]);

      if (target) {
        target.removeEventListener('pointercancel', onPointerCancel);
        target.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [embedded, map, target]);

  if (!embedded || !map || !show) {
    return null;
  }

  return (
    <div
      className={classes.wrapper}
      tabIndex={0}
      role="button"
      onClick={() => {
        setShow(false);
      }}
      onKeyUp={(evt) => {
        if (evt.which === 13) {
          setShow(false);
        }
      }}
    >
      <div className={classes.icon}>
        <NoDragPanWarningIcon />
      </div>
      <Typography variant="h4" align="center" className={classes.text}>
        {t('Benutzen Sie 2 Finger um die Karte zu bedienen.')}
      </Typography>
    </div>
  );
}

export default React.memo(NoDragPanWarning);
