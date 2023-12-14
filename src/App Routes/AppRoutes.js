import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import style from "./AppRoutes.module.css";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import CreateProject from "../pages/CreateProject/CreateProject";
import Projects from "../pages/Projects/Projects";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function AppRoutes() {
  return (
    <Router>
      <Header />
      <div className={style.container}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
