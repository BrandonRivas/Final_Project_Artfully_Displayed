import styled from "styled-components";
import { useState } from "react";

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSpotlightOn, setIsSpotlightOn] = useState(true);

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleClick = () => {
    setIsSpotlightOn(!isSpotlightOn);
  };

  return (
    <ContentDiv onMouseMove={handleMouseMove} onClick={handleClick}>
      {isSpotlightOn && <SpotlightDiv mousePosition={mousePosition} />}
      <ImageDiv>
        <CenterDiv>
          <Img src="/frame.png" alt="a golden picture frame" />
          <TextDiv>
            <Title>Artfully Displayed</Title>
            <SubTitle>A Catalogue of Masterpieces</SubTitle>
            <Button>Look Inside</Button>
          </TextDiv>
        </CenterDiv>
      </ImageDiv>
    </ContentDiv>
  );
};

const ContentDiv = styled.div``;

const SpotlightDiv = styled.div`
  position: absolute;
  top: ${({ mousePosition }) => mousePosition.y - 250}px;
  left: ${({ mousePosition }) => mousePosition.x - 250}px;
  height: 500px;
  width: 500px;
  border-radius: 50%;
  box-shadow:  0px 0px 0px 9999px rgba(0, 0, 0, 0.8);
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

`
const Title = styled.h1`
  color: var(--color-old-lace);
  font-size: 140px;
  @media screen and (max-width: 1275px) {
    font-size: 120px;
  }
  @media screen and (max-width: 1092px) {
    font-size: 100px;
  }
  @media screen and (max-width: 910px) {
    font-size: 60px;
  }
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
  background: none;
  border: 1px solid var(--color-old-lace);
  padding: 20px 40px;
  margin-top: 60px;
  font-size: 15px;
`;

export default HomePage;
