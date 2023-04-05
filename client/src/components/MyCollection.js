import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import CommentSection from "./CommentSection";
import Loading from "./Loading";

const MyCollection = () => {
  const { isLoading, isAuthenticated, user } = useAuth0();
  const [status, setStatus] = useState();
  const [posted, setPosted] = useState(false);
  const [favorite, setFavorite] = useState();
  const [showButton, setShowButton] = useState(false);

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
          setStatus(data.status);
          setFavorite(data.data[0].favorite);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, status, posted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
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
              {!favorite ? (
                <>
                  <Loading />
                  {showButton && (
                    <>
                      <NoLikes>
                        It doesn't look like you have a collection yet!{" "}
                      </NoLikes>
                      <StartButton status={status} onClick={createCollection}>
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
                      <CollectionDiv>
                        {favorite.map((object) => {
                          return (
                            <IndividualDiv key={object.id}>
                              <Img src={object.webImage.url} />
                              <TextDiv>
                                <p>{object.longTitle}</p>
                                <p>{object.principalOrFirstMaker}</p>
                                <p>Object number: {object.objectNumber}</p>
                              </TextDiv>
                            </IndividualDiv>
                          );
                        })}
                      </CollectionDiv>
                      <CommentSection />
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
  border: 2px solid red;
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
export default MyCollection;
