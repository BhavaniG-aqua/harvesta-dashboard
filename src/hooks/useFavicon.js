import { useEffect } from "react";
import grootImage from "../assets/defaultProfilePhoto";

// The browser tab favicon is permanently fixed to the Groot mascot image
// — it is NOT tied to the user's profile photo (that's a separate,
// user-changeable value shown in the Sidebar circle and Settings). This
// hook takes no arguments on purpose: there is nothing to configure, the
// favicon never changes no matter what photo the user uploads.
export function useFavicon() {
  useEffect(() => {
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.type = "image/png";
    link.href = grootImage;
  }, []);
}
