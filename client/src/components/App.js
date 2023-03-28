import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "../GlobalStyles";
import HomePage from "./HomePage";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="" element={<h1>404: Oops!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
