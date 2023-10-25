import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useListenMessage = (messageEvents, element) => {
  useEffect(() => {
    let eventCache = [];
    if (messageEvents?.length) {
      messageEvents.forEach((messageEvent) => {
        const callback = (evt) => {
          if (
            evt.type === messageEvent.eventType ||
            evt.data === messageEvent.eventType
          ) {
            messageEvent.callback(evt);
          }
        };
        window.addEventListener('message', callback);
        element?.addEventListener(messageEvent.eventType, callback);
        eventCache = ['message', messageEvent.eventType].map((eventType) => ({
          eventType,
          callback,
        }));
      });
    }

    return () => {
      eventCache.forEach((event) => {
        window.removeEventListener(event.eventType, event.callback);
        element?.removeEventListener(event.eventType, event.callback);
      });
    };
  }, [messageEvents, element]);
};

function MessageListener({ element }) {
  const activeTopic = useSelector((state) => state.app.activeTopic);
  useListenMessage(activeTopic?.messageEvents, element);

  return null;
}

MessageListener.propTypes = {
  element: PropTypes.object,
};

MessageListener.defaultProps = {
  element: null,
};

export default MessageListener;
