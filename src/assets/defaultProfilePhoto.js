// Central re-export for the app's default profile photo / mascot image.
// Used as the fallback avatar (sidebar circle, Settings profile picker)
// and the default favicon whenever the user hasn't uploaded their own
// profile photo yet — as soon as they upload one via Settings, that
// upload takes over everywhere this default is used.
import grootImage from "./groot.png";

export default grootImage;
