import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useListenMessage = (callback, eventType = 'trafimage-event') => {
  const tm = document.getElementsByTagName('trafimage-maps')[0];
  useEffect(() => {
    if (callback) {
      tm?.addEventListener(eventType, callback);
      window.addEventListener('message', callback);
    }
    return () => {
      tm?.removeEventListener(eventType, callback);
      window.removeEventListener('message', callback);
    };
  }, [callback, eventType, tm]);
};

function MessageListener() {
  const activeTopic = useSelector((state) => state.app.activeTopic);
  useListenMessage(
    activeTopic?.messageConfig?.callback,
    activeTopic?.messageConfig?.eventType,
  );

  return null;
}

export default MessageListener;
