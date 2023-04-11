import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "../GlobalStyles";
import LandingPage from "./LandingPage";
import Collection from "./Collection";
import NavBar from "./NavBar";
import MyCollection from "./MyCollection";
import SingleObject from "./SingleObject";
import { useState } from "react";


const App = () => {
  const [favorite, setFavorite] = useState();

  return (
    <BrowserRouter>
      <GlobalStyles />
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/collection"
          element={<Collection favorite={favorite} setFavorite={setFavorite} />}
        />
        <Route path="/collection/:id" element={<SingleObject />} />
        <Route
          path="/mycollection"
          element={
            <MyCollection favorite={favorite} setFavorite={setFavorite} />
          }
        />
        <Route path="" element={<h1>404: Oops!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
