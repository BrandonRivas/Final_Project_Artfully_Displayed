import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import CommentSection from "./CommentSection";
import Loading from "./Loading";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Intro from "./Intro";
import EditMenu from "./EditMenu";

const MyCollection = ({ favorite, setFavorite }) => {
  const { isLoading, isAuthenticated, user } = useAuth0();
  //this toggles a state to re-render if a user creates a collection for the first time
  const [posted, setPosted] = useState(false);
  //if the user has never created a collection this will toggle state to show a button to do so.
  const [showButton, setShowButton] = useState(false);
  //this toggles the state to display the edit features
  const [isEditMode, setIsEditMode] = useState(false);
  //this toggles a rerender after a delete and intro update,
  const [rerender, setRerender] = useState(false);
  //if an error is caught this will display an error message
  const [error, setError] = useState(null);
  //this is to set the intro to/from the database
  const [intro, setIntro] = useState();

  // once the user is authenticated through auth0 it will fetch and set the favorite collection and intro to state
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/mycollection/${user.sub}`)
        .then((response) => response.json())
        .then((data) => {
          setFavorite(data.data[0].favorite);
          setIntro(data.data[0].intro);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, posted, rerender, setFavorite]);

  // this function is to create a collection based on the user's id to mongodb. It includes an
  //empty favorite array and a basic intro
  const createCollection = () => {
    fetch("/collection", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: user.sub,
        favorite: [],
        intro: "Insert an intro about your virtual exhibition",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setPosted(!posted);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to create collection.");
      });
  };

  //this is to delay the button to create a user collection in the instance that
  //fetching the collection takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  //this is to delete an object based on it's id and to only be deleted from the collection
  //associated to the specific user
  const handleDelete = (objectId) => {
    fetch(`/mycollection/${user.sub}/${objectId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setRerender(!rerender);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to delete.");
      });
  };

  //on click of the image or text of the object, it will open a new window to the single object page
  const handleClick = (objectId) => {
    window.open(`/collection/${objectId}`);
  };

  // if any errors are caught, it will be displayed in this div
  if (error) {
    return <ErrorDiv>{error}</ErrorDiv>;
  }

  return (
    <Wrapper>
      <TitleDiv>
        <h1>My Collection</h1>
      </TitleDiv>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!isAuthenticated ? (
            <LoginDiv>
              <h1>Please login to use this feature</h1>
            </LoginDiv>
          ) : (
            <>
              {}
              {!favorite ? (
                <>
                  <Loading />
                  {showButton && (
                    <>
                      <NoLikes>
                        It doesn't look like you have a collection yet!{" "}
                      </NoLikes>
                      <StartButton onClick={createCollection}>
                        Click here to get started
                      </StartButton>
                    </>
                  )}
                </>
              ) : (
                <>
                  {favorite.length === 0 ? (
                    <NoLikes>
                      You don't have any favorites, click a heart on the search
                      page to add them here!
                    </NoLikes>
                  ) : (
                    <>
                      <EditMenu
                        user={user}
                        setFavorite={setFavorite}
                        setError={setError}
                        setIsEditMode={setIsEditMode}
                        isEditMode={isEditMode}
                      />
                      <Intro
                        intro={intro}
                        isEditMode={isEditMode}
                        user={user}
                        rerender={rerender}
                        setRerender={setRerender}
                        setError={setError}
                      />
                      <CollectionDiv>
                        {favorite.map((object) => {
                          return (
                            <IndividualDiv key={object.id}>
                              {isEditMode && (
                                <Garbage
                                  onClick={() => handleDelete(object.id)}
                                />
                              )}
                              <div
                                onClick={() => handleClick(object.objectNumber)}
                              >
                                <Img src={object.webImage.url} />
                                <TextDiv>
                                  <Title>{object.longTitle}</Title>
                                  <p>{object.principalOrFirstMaker}</p>
                                  <p>Object number: {object.objectNumber}</p>
                                </TextDiv>
                              </div>
                            </IndividualDiv>
                          );
                        })}
                      </CollectionDiv>
                      <CommentSection isEditMode={isEditMode} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 30px;
`;

const TitleDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-size: 70px;
  opacity: 50%;
`;

const IndividualDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 480px;

  @media screen and (max-width: 1500px) {
    width: 380px;
  }
  @media screen and (max-width: 1200px) {
    width: 280px;
  }

  @media screen and (max-width: 768px) {
    width: 215px;
  }
`;
const StartButton = styled.button`
  display: ${(props) => (props.status === 200 ? "none" : "inline")};
  padding: 10px 20px;
  opacity: 50%;
  transition: opacity 500ms cubic-bezier(0.3, 0.1, 0.3, 1);
  :hover {
    opacity: 100%;
  }
`;

const CollectionDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
  margin-top: 20px;
`;
const TextDiv = styled.div`
  text-align: center;
`;
const Img = styled.img`
  width: 480px;
  height: 500px;
  object-fit: cover;
  object-position: top;
  @media screen and (max-width: 1500px) {
    width: 380px;
    height: 400px;
  }
  @media screen and (max-width: 1200px) {
    width: 280px;
    height: 300px;
  }

  @media screen and (max-width: 768px) {
    width: 215px;
    height: 226px;
  }
`;
const NoLikes = styled.p`
  margin-top: 30px;
  font-size: 20px;
  margin-bottom: 10px;
`;

const Garbage = styled(MdOutlineDeleteOutline)`
  font-size: 20px;
  position: absolute;
  margin-left: 23vw;
  margin-top: 10px;
  background-color: rgba(41, 115, 115, 0.8);
  padding: 2px;
  border-radius: 5px;
  :hover {
    opacity: 50%;
  }
`;

const Title = styled.p`
  font-family: var(--font-headers);
  margin-bottom: 5px;
  margin-top: 2px;
`;

const ErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  font-size: 25px;
`;

export default MyCollection;
