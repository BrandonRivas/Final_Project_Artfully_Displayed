import styled from "styled-components";
import SearchBar from "./SearchBar";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAuth0 } from "@auth0/auth0-react";
import { FiHeart } from "react-icons/fi";

const Collection = ({ favorite, setFavorite }) => {
  //states from auth0 about the user
  const { isAuthenticated, user } = useAuth0();
  //this will contain the collection after being fetched from the museum
  const [collection, setCollection] = useState();
  //this contains the search value from the text input to be used as a query
  const [searchValue, setSearchValue] = useState("");
  //this contains the radio button value for the query in the search
  const [radioButtonSelect, setRadioButtonSelect] = useState("");
  //this is the state that contains the current page
  const [page, setPage] = useState(1);
  //this setState is for toggling if an object is liked to re-fetch
  const [liked, setLiked] = useState(false);
  //this track the state of clicked hearts
  const [buttonClicked, setButtonClicked] = useState({});
  //this is the state that will be set for any errors
  const [error, setError] = useState(null);

  //this is the fetch that will retrieve the data from the museum. If there is a search value, a radio button value,
  //or both it will be directed to the correct endpoint and provide the according query values
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
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to fetch collection data.");
      });
  }, [page, searchValue, radioButtonSelect]);

  //this will primarily add favorites to the favorite key objects in mongodb
  //it will also disable the heart after it's been clicked
  const handleLike = (object) => {
    setButtonClicked((prevState) => ({
      ...prevState,
      [object.id]: true,
    }));
    fetch(`/mycollection/${user.sub}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favorite: object,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setLiked(!liked);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to add to favorites.");
      });
  };

  //this fetches the favorite collection and sets it to a state. This is so that we can update the favorite collection
  //after each like, and allows the hearts to change color if they've been liked.
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
  }, [setFavorite, isAuthenticated, user, liked]);

  //this will change the the state of page -1 to allow us to navigate to the previous page,
  // and will also scroll up to the top when clicked
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  //this will change the the state of page +1 to allow us to navigate to the next page,
  // and will also scroll up to the top when clicked
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

//if you click on an image or on it's text the user will be brought the the single object
//page according to it's id
  const handleClick = (objectId) => {
    window.open(`/collection/${objectId}`);
  };

//this function checks to see if it is already in the favorite collection. If it is, it returns true
//and will turn red, if it isn't, it returns false. 
  const isObjectInFav = (objectId) => {
    if (favorite) {
      const foundItem = favorite.find((item) => item.id === objectId);
      if (!foundItem) {
        return false;
      }
      return true;
    }
    return false;
  };

  //if an error is caught it will be displayed in this div
  if (error) {
    return <ErrorDiv>{error}</ErrorDiv>;
  }

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
              {collection.length === 0 ? (
                <div>
                  <Sorry>
                    Sorry we could not find any results with {searchValue} in{" "}
                    {radioButtonSelect}
                  </Sorry>
                </div>
              ) : (
                <>
                  {collection.map((object) => {
                    return (
                      <ArtContainer key={object.id}>
                        <div onClick={() => handleClick(object.objectNumber)}>
                          {object.webImage === null ? (
                            <Img src="/sorry.png" />
                          ) : (
                            <Img src={object.webImage.url} alt="" />
                          )}
                        </div>
                        {isAuthenticated && object.webImage && (
                          <TestButton
                            disabled={
                              buttonClicked[object.id] ||
                              isObjectInFav(object.id)
                            }
                            onClick={() => handleLike(object)}
                          >
                            <OutlineHeart
                              fav={isObjectInFav(object.id).toString()}
                            />
                          </TestButton>
                        )}
                        <div
                          onClick={(event) =>
                            handleClick(event, object.objectNumber)
                          }
                        >
                          <Title>{object.title}</Title>
                          <Maker>{object.principalOrFirstMaker}</Maker>
                        </div>
                      </ArtContainer>
                    );
                  })}
                </>
              )}
            </SecondDiv>
            <DirectionDiv>
              <DirectionButtonPrev
                onClick={handlePreviousPage}
                disabled={page <= 1}
              >
                Previous
              </DirectionButtonPrev>
              <PageNumber>Page {page}</PageNumber>
              <DirectionButtonNext
                onClick={handleNextPage}
                disabled={collection.length < 19}
              >
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
  gap: 15px;
  padding-top: 15px;
`;

const ArtContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 455px;
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
  text-align: center;
`;

const OutlineHeart = styled(FiHeart)`
  font-size: 20px;
  fill: ${(props) => (props.fav === "true" ? "red" : "none")};
  color: ${(props) => (props.fav === "true" ? "red" : "#F8F0DE")};
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
  :disabled {
    opacity: 50%;
  }
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

const Sorry = styled.p`
  font-size: 20px;
  margin-top: 20px;
  font-family: var(--font-headers);
`;

const TestButton = styled.button`
  padding: 0;
  background-color: transparent;
  width: 22px;
  height: 22px;
  margin-top: -30px;
  margin-left: 350px;
  :disabled {
    cursor: not-allowed;
  }
`;

const ErrorDiv = styled.div`
  display: flex;
  position: absolute;
  margin-top: 150px;
  margin-left: 40vw;
  font-size: 25px;
`;
export default Collection;
