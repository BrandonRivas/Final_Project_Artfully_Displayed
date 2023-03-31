import styled from "styled-components";
import SearchBar from "./SearchBar";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAuth0 } from "@auth0/auth0-react";
import { FiHeart } from "react-icons/fi";

const Collection = () => {
  const { isAuthenticated } = useAuth0();
  const [collection, setCollection] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [radioButtonSelect, setRadioButtonSelect] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let endpoint = `/collection?p=${page}`;

    if (searchValue) {
      endpoint = `/collection?p=${page}&q=${searchValue}`;
    }

    if (radioButtonSelect) {
      endpoint = `/collection?p=${page}&type=${radioButtonSelect}`;
    }

    if (searchValue && radioButtonSelect) {
      endpoint = `/collection?p=${page}&q=${searchValue}&type=${radioButtonSelect}`;
    }
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setCollection(data.data.artObjects);
      });
  }, [page, searchValue, radioButtonSelect]);
  console.log(radioButtonSelect);
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Div>
        <H1>The Collection</H1>
        <SearchBar
          setSearchValue={setSearchValue}
          setRadioButtonSelect={setRadioButtonSelect}
          setPage={setPage}
        />
        {!collection ? (
          <LoadingDiv>
            <Loading />
          </LoadingDiv>
        ) : (
          <>
            <SecondDiv>
              {collection.map((object) => {
                return (
                  <ArtContainer key={object.id}>
                    {object.webImage === null ? (
                      <Img src="/sorry.png" />
                    ) : (
                      <Img src={object.webImage.url} alt="" />
                    )}
                    {isAuthenticated && object.webImage && <OutlineHeart />}
                    <Title>{object.title}</Title>
                    <Maker>{object.principalOrFirstMaker}</Maker>
                  </ArtContainer>
                );
              })}
            </SecondDiv>
            <DirectionDiv>
              <DirectionButtonPrev
                onClick={handlePreviousPage}
                disabled={page <= 1}
              >
                Previous
              </DirectionButtonPrev>
              <PageNumber>Page {page}</PageNumber>
              <DirectionButtonNext onClick={handleNextPage}>
                Next
              </DirectionButtonNext>
            </DirectionDiv>
          </>
        )}
      </Div>
    </>
  );
};
const Div = styled.div`
  width: 96vw;
  height: 100%;
  margin-top: 5.5vw;
  position: absolute;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const H1 = styled.h1`
  font-size: 70px;
  opacity: 50%;
  margin-bottom: 10px;
  @media screen and (max-width: 1800px) {
    font-size: 60px;
  }

  @media screen and (max-width: 1200px) {
    font-size: 50px;
  }

  @media screen and (max-width: 768px) {
    font-size: 40px;
  }
`;
const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const SecondDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-top: 15px;
`;

const ArtContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 450px;
  width: 385px;

  @media screen and (max-width: 1200px) {
    height: 350px;
  }
  @media screen and (max-width: 1150px) {
    height: 370px;
  }
  @media screen and (max-width: 768px) {
    height: 290px;
  }
`;

const Img = styled.img`
  width: 380px;
  height: 400px;
  object-fit: cover;
  object-position: top;
  @media screen and (max-width: 1200px) {
    width: 280px;
    height: 300px;
  }

  @media screen and (max-width: 768px) {
    width: 215px;
    height: 226px;
  }
`;

const Title = styled.h2`
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;
  margin-bottom: 4px;
  padding-top: 10px;
`;
const Maker = styled.p`
  font-style: italic;
`;

const OutlineHeart = styled(FiHeart)`
  font-size: 25px;
  margin-top: -30px;
  margin-left: 350px;
  :hover {
    color: red;
    fill: red;
  }
`;

const DirectionButtonPrev = styled.button`
  padding: 10px 30px;
  :disabled {
    opacity: 50%;
  }
`;
const DirectionButtonNext = styled.button`
  padding: 10px 42px;
`;
const DirectionDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  padding-bottom: 30px;
`;

const PageNumber = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;
export default Collection;
