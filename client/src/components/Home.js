import styled from "styled-components";
import SearchBar from "./SearchBar";
const Home = () => {
  return (
    <>
      <Div>
        <SearchBar />
        <SecondDiv></SecondDiv>
      </Div>
    </>
  );
};
const Div = styled.div`
  border: 2px solid green;
  width: 96vw;
  height: 100%;
  margin-top: 5.5vw;
  position: absolute;
  margin-left: 30px;
`;
const SecondDiv = styled.div`
  border: 2px solid yellow;
  height: 100%;
`;
export default Home;
