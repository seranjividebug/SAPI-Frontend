import ObsidianLayout from "../common/ObsidianLayout";
import { HomeBody } from "./HomeMarkup";

// Home page ("SAPI Obsidian" design). field.js drives the particle field over HomeBody's markup.
export default function MainPage() {
  return (
    <ObsidianLayout
      page="home"
      vendors={["THREE", "gsap", "ScrollTrigger", "Lenis"]}
      scripts={["/assets/js/motion.js", "/assets/js/field.js"]}
    >
      <HomeBody />
    </ObsidianLayout>
  );
}
