import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "../GlobalStyles";
import LandingPage from "./LandingPage";
import Collection from "./Collection";
import NavBar from "./NavBar";
import MyCollection from "./MyCollection";
import SingleObject from "./SingleObject";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const [favorite, setFavorite] = useState([]);
  const [liked, setLiked] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const [rerender, setRerender] = useState(false);
  const [posted, setPosted] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/mycollection/${user.sub}`)
        .then((response) => response.json())
        .then((data) => {
          setFavorite(data.data[0].favorite);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [setFavorite, isAuthenticated, user, liked, posted, rerender]);

  return (
    <BrowserRouter>
      <GlobalStyles />
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/collection"
          element={
            <Collection
              favorite={favorite}
              setFavorite={setFavorite}
              liked={liked}
              setLiked={setLiked}
            />
          }
        />
        <Route path="/collection/:id" element={<SingleObject />} />
        <Route
          path="/mycollection"
          element={
            <MyCollection
              favorite={favorite}
              setFavorite={setFavorite}
              posted={posted}
              setPosted={setPosted}
              rerender={rerender}
              setRerender={setRerender}
            />
          }
        />
        <Route path="" element={<h1>404: Oops!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
