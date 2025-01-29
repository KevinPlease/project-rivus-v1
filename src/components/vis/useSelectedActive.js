import { useEffect } from "react";

export const useSelectedActive = (selected, prevElement, onElementSelected) => {
  useEffect(() => {
    if (selected) {
      if (prevElement) {
        prevElement.classList.remove("active");
      }

      let el = document.getElementById(selected);
      if (el) {
        el.classList.add("active");
        onElementSelected?.(el);
      }
    }
  }, [selected, prevElement]);
};

