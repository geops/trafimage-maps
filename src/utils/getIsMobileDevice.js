const getIsMobileDevice = () => {
  return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export default getIsMobileDevice;
