/* eslint-disable no-param-reassign */
import { useEffect } from 'react';

/**
 * This hook disable the elastic ios effect when the scroll reach the beging or the end of a scrollable element.
 * This behavior should be done by the css property overscroll-behavior: auto.
 * Only on iPhone all browsers and when embedded=true
 */
const useDisableIosElasticScrollEffect = (element) => {
  useEffect(() => {
    if (!element || !/iPhone/.test(navigator.userAgent)) {
      return () => {};
    }
    let startY;
    let ignoreScroll = false;
    const initialOverflow = getComputedStyle(element).overflow;
    const onTouchStart = (evt) => {
      startY = evt.touches[0].clientY;
    };

    const onTouchMove = (evt) => {
      ignoreScroll = false;
      const goesUp = evt.touches[0].clientY - startY > 0;
      const goesDown = evt.touches[0].clientY - startY < 0;
      const top = element.scrollTop;
      const totalScroll = element.scrollHeight;
      const currentScroll = top + element.offsetHeight;
      if (element.scrollTop <= 0 && goesUp) {
        element.scrollTop = 0;
        ignoreScroll = true;
      } else if (goesDown && currentScroll >= totalScroll) {
        element.scrollTop = element.scrollHeight;
        ignoreScroll = true;
      }
      if (ignoreScroll) {
        // This line will force the scroll of the parent on next user scroll
        element.style.overflow = 'hidden';
      } else {
        element.style.overflow = initialOverflow;
      }
    };

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.style.overflow = initialOverflow;
    };
  }, [element]);

  return null;
};

export default useDisableIosElasticScrollEffect;
