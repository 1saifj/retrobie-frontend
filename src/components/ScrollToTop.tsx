import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {

  // This scrolls to the top of any
  // page that's mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}