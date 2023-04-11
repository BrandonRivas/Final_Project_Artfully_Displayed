import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineLightBulb } from "react-icons/hi";

const LandingPage = () => {
  //sets the x and y values of the mouse so that the shadow effect can work
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  //this toggles the spotlight on and off
  const [isSpotlightOn, setIsSpotlightOn] = useState(true);

  const navigate = useNavigate();

  //this is the function that tracks the position of the mouse on the screen
  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  //this function toggles the spotlight on and off
  const handleClick = () => {
    setIsSpotlightOn(!isSpotlightOn);
  };

  //the button at the center of the screen will lead us to the collection page on click
  const handleButton = (event) => {
    event.preventDefault();
    navigate("/collection");
  };
  return (
    <>
      <div onMouseMove={handleMouseMove} onClick={handleClick}>
        {isSpotlightOn && <SpotlightDiv mousePosition={mousePosition} />}
        <ImageDiv>
          <CenterDiv>
            <Img src="/frame.png" alt="a golden picture frame" />
            <TextDiv>
              <Title>Artfully Displayed</Title>
              <SubTitle>A Catalogue of Masterpieces</SubTitle>
              <Button onClick={handleButton}>Look Inside</Button>
            </TextDiv>
            {isSpotlightOn && (
              <LightContainer>
                <LightBulb />
                <p>Click to turn on the lights</p>
              </LightContainer>
            )}
          </CenterDiv>
        </ImageDiv>
      </div>
    </>
  );
};

const SpotlightDiv = styled.div`
  position: absolute;
  top: ${({ mousePosition }) => mousePosition.y - 200}px;
  left: ${({ mousePosition }) => mousePosition.x - 200}px;
  height: 400px;
  width: 400px;
  border-radius: 50%;
  box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const ImageDiv = styled.div`
  background-image: url("/fruits.png");
  height: 100vh;
  width: 100vw;
  background-size: cover;
`;

const Img = styled.img`
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1275px) {
    height: 80%;
  }
  @media screen and (max-width: 910px) {
    height: 60%;
  }
`;

const CenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const TextDiv = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  color: var(--color-old-lace);
  font-size: 7.5vw;
`;

const SubTitle = styled.p`
  font-size: 25px;
  padding-top: 1em;
  @media screen and (max-width: 1275px) {
    font-size: 20px;
  }
  @media screen and (max-width: 1092px) {
    font-size: 15px;
  }
`;

const Button = styled.button`
  position: absolute;
  background: none;
  border: 1px solid var(--color-old-lace);
  padding: 20px 40px;
  margin-top: 400px;
  font-size: 15px;
  cursor: pointer;
  transition: all 500ms cubic-bezier(0.3, 0.1, 0.3, 1);
  :hover {
    padding: 25px 45px;
  }
  @media screen and (max-width: 1275px) {
    margin-top: 350px;
  }
  @media screen and (max-width: 910px) {
    margin-top: 250px;
  }
  @media screen and (max-height: 720px) {
    margin-top: 50vh;
  }
`;

const LightContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 91vh;
  z-index: 5;
  opacity: 50%;
  display: flex;
  align-items: center;
`;
const LightBulb = styled(HiOutlineLightBulb)`
  font-size: 50px;
`;

export default LandingPage;
