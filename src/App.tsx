import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import AboutPage from "./pages/AboutPage";
import ContactButton from "./components/ContactButton";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// On the home page the Contact me button first lives under the headline; the
// floating one only appears once the visitor scrolls past it.
function FloatingContact() {
  const { pathname } = useLocation();
  const [scrolledPast, setScrolledPast] = useState(false);
  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome) return;
    const target = document.getElementById("hero-contact");
    if (!target) return;
    const update = () => setScrolledPast(target.getBoundingClientRect().bottom < 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [onHome]);

  return <ContactButton hidden={onHome && !scrolledPast} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <FloatingContact />
    </BrowserRouter>
  );
}
