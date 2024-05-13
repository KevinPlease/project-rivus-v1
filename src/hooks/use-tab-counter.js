import { useEffect } from "react";

export const useTabCounter = (onExtermination) => {
  useEffect(() => {
    let tabsOpen = window.localStorage.getItem("tabsOpenCounter");

    if (tabsOpen === null) {
      tabsOpen = 1;
      
    } else {
      tabsOpen = parseInt(tabsOpen) + parseInt(1);
    }
    
    localStorage.setItem("tabsOpenCounter", tabsOpen);

    window.onunload = function(e) {
      const tabCount = localStorage.getItem("tabsOpenCounter");
      if (tabCount !== null) {
        const newTabCount = tabCount - 1;
        localStorage.setItem("tabsOpenCounter", newTabCount);
        if (newTabCount <= 0) onExtermination?.();
      }
    };
    
  }, []);
};
