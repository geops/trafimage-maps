import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const useIsMobile = () => {
  const screenWidth = useSelector((state) => state.app.screenWidth);
  const isMobile = useMemo(() => {
    return ['xs'].includes(screenWidth);
  }, [screenWidth]);
  return isMobile;
};

export default useIsMobile;
