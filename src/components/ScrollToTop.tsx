import { useEffect } from "react";

export default function ScrollToTop() {

  // This scrolls to the top of any
  // page that's mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}
