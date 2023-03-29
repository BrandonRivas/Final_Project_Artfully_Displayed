import styled from "styled-components";
const Home = () => {
  return (
    <>
      <Div>
        <h1>HEY QUEEN</h1>
      </Div>
    </>
  );
};
const Div = styled.div`
  border: 2px solid green;
  width: 96vw;
  //110 is right to the bottom of the nav
  margin-top: 165px;
  position: absolute;
  margin-left: 30px;
`;
export default Home;
