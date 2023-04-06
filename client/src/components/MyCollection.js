import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import CommentSection from "./CommentSection";
import Loading from "./Loading";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

const MyCollection = ({ favorite, setFavorite }) => {
  const { isLoading, isAuthenticated, user } = useAuth0();
  const [posted, setPosted] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rerender, setRerender] = useState(false);
 

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
        collection: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPosted(!posted);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
  }, [user, posted, rerender, setFavorite]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const showMenu = () => {
    setHidden(!hidden);
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };
  const handleDelete = (objectId) => {
    fetch(`/mycollection/${user.sub}/${objectId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRerender(!rerender);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteAll = () => {
    fetch(`/mycollection/${user.sub}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFavorite([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
                      <ButtonDiv hidden={hidden}>
                        <Edit onClick={handleEditClick}>Edit</Edit>
                        <DeleteAllButton onClick={deleteAll}>
                          Delete All
                        </DeleteAllButton>
                      </ButtonDiv>
                      <MenuDiv>
                        <Menu onClick={showMenu} />
                      </MenuDiv>
                      <CollectionDiv>
                        {favorite.map((object) => {
                          return (
                            <IndividualDiv key={object.id}>
                              {isEditMode && (
                                <Garbage
                                  onClick={() => handleDelete(object.id)}
                                />
                              )}

                              <Img src={object.webImage.url} />
                              <TextDiv>
                                <Title>{object.longTitle}</Title>
                                <p>{object.principalOrFirstMaker}</p>
                                <p>Object number: {object.objectNumber}</p>
                              </TextDiv>
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
`;

const MenuDiv = styled.div`
  position: absolute;
  top: 50px;
  margin-left: 540px;
  z-index: 6;
`;
const Menu = styled(GiHamburgerMenu)`
  font-size: 20px;
  opacity: 50%;
  transition: opacity 500ms cubic-bezier(0.3, 0.1, 0.3, 1);
  :hover {
    opacity: 100%;
  }
`;
const ButtonDiv = styled.div`
  display: flex;
  display: ${(props) => (props.hidden ? "inline" : "none")};
`;
const Edit = styled.button`
  padding: 10px 20px;
`;
const DeleteAllButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
`;

const Title = styled.p`
  font-family: var(--font-headers);
  margin-bottom: 5px;
  margin-top: 2px;
`;
export default MyCollection;
