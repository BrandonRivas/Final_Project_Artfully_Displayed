import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "../GlobalStyles";
import LandingPage from "./LandingPage";
import Collection from "./Collection";
import NavBar from "./NavBar";
import MyCollection from "./MyCollection";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/mycollection" element={<MyCollection />} />
        <Route path="" element={<h1>404: Oops!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
