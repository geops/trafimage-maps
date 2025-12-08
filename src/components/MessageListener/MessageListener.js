import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function MessageListener() {
  const messageEvents = useSelector(
    (state) => state.app.activeTopic?.messageEvents,
  );

  useEffect(() => {
    const abrtCtrl = new AbortController();
    const { signal } = abrtCtrl;
    (messageEvents || []).forEach((messageEvent) => {
      const callback = (evt) => {
        if (
          evt.type === messageEvent.eventType ||
          evt.data === messageEvent.eventType
        ) {
          messageEvent.callback(evt);
        }
      };
      window.addEventListener("message", callback, { signal });
    });

    return () => {
      abrtCtrl.abort();
    };
  }, [messageEvents]);

  return null;
}

export default React.memo(MessageListener);
