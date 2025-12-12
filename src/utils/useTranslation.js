import { useMemo } from "react";
import { useSelector } from "react-redux";

function useTranslation() {
  const i18n = useSelector((state) => state.app.i18n);
  const language = useSelector((state) => state.app.language);

  const obj = useMemo(() => {
    return {
      t: i18n.t,
      i18n,
      language,
    };
  }, [language, i18n]);

  return obj;
}

export default useTranslation;
