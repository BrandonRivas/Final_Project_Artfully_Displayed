import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "../GlobalStyles";
import LandingPage from "./LandingPage";
import Home from "./Home";
import NavBar from "./NavBar";

const App = () => {

  return (
    <BrowserRouter>
      <GlobalStyles />
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="" element={<h1>404: Oops!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
