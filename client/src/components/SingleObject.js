import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Loading from "./Loading";
import { IoIosInformationCircleOutline } from "react-icons/io";

const SingleObject = () => {
  const { id } = useParams();
  const [object, setObject] = useState();
  const [enlarged, setEnlarged] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    fetch(`/collection/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setObject(data.data.artObject);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  console.log(object);

  const handleEnlargeClick = () => {
    setEnlarged(!enlarged);
  };

  const handleClick = () => {
    setDisplay(!display);
    setTimeout(() => {
      const scrollToOptions = {
        top: document.body.scrollHeight,
        behavior: "smooth",
      };
      window.scrollTo(scrollToOptions);
    }, 300);
  };
  return (
    <Wrapper>
      {!object ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : (
        <div>
          {object.webImage === null ? (
            <Img src="/sorry.png" />
          ) : (
            <Img
              src={object.webImage.url}
              alt={`${object.id}'s image`}
              enlarged={enlarged}
            />
          )}
          <ButtonDiv>
            <Button onClick={handleEnlargeClick}>
              {enlarged ? "Shrink" : "Enlarge"}
            </Button>
            <Info
              onMouseEnter={() => setHidden(true)}
              onMouseLeave={() => setHidden(false)}
              onClick={handleClick}
            />
            <MoreInfoP hidden={hidden}>
              Click for more information about this object
            </MoreInfoP>
          </ButtonDiv>
          <TextDiv>
            <H2>{object.title}</H2>
            <MakerP>{object.scLabelLine}</MakerP>
            <DescriptionP>{object.label.description}</DescriptionP>{" "}
            <TableDiv display={display}>
              <p>Number</p>
              <p>
                {object.objectNumber
                  ? object.objectNumber
                  : "Sorry no data available"}
              </p>
              <p>Location</p>
              <p>
                {object.location ? object.location : "Sorry no data available"}
              </p>
              <p>Medium</p>
              <p>
                {object.physicalMedium
                  ? object.physicalMedium
                  : "Sorry no data available"}
              </p>
              <p>Description</p>
              <p>
                {object.plaqueDescriptionEnglish
                  ? object.plaqueDescriptionEnglish
                  : "Sorry no data available"}
              </p>
              <p>Maker</p>
              <p>
                {object.principalMaker
                  ? object.principalMaker
                  : "Sorry no data available"}
              </p>
              <p>Date</p>
              <p>
                {object.dating.presentingDate
                  ? object.dating.presentingDate
                  : "Sorry no data available"}
              </p>
            </TableDiv>
          </TextDiv>
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const Img = styled.img`
  width: 100%;
  height: ${(props) => (props.enlarged ? "100%" : "95vh")};
  object-fit: cover;
`;

const Button = styled.button`
  padding: 10px 20px;
  opacity: 40%;
  transition: opacity 500ms cubic-bezier(0.3, 0.1, 0.3, 1);
  :hover {
    opacity: 100%;
  }
`;
const TextDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -35px;
`;
const H2 = styled.h2`
  font-size: 50px;
  text-align: center;
`;

const MakerP = styled.p`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
`;
const DescriptionP = styled.p`
  width: 60%;
  font-size: 18px;
`;

const Info = styled(IoIosInformationCircleOutline)`
  font-size: 30px;
  margin-left: 10px;
  opacity: 40%;
  transition: opacity 500ms cubic-bezier(0.3, 0.1, 0.3, 1);
  :hover {
    opacity: 100%;
  }
`;

const ButtonDiv = styled.div`
  top: -50px;
  position: relative;
  margin-left: 20px;
  display: flex;
  align-items: center;
  transition: all 500ms cubic-bezier(0.3, 0.1, 0.3, 1);
`;

const MoreInfoP = styled.p`
  display: ${(props) => (props.hidden ? "inline" : "none")};
  opacity: 70%;
  margin-left: 10px;
  padding: 10px;
  background-color: var(--color-raisin-black);
  border-radius: 10px;
`;
const TableDiv = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(2, 20vw);
  grid-template-rows: repeat(6, 0.3fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  overflow: hidden;
  max-height: ${(props) => (props.display ? "1000px" : "0")};
  transition: max-height 0.5s ease-in-out;
  margin-top: 40px;
  margin-bottom: 50px;
`;

export default SingleObject;
