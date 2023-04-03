import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import CommentSection from "./CommentSection";

const MyCollection = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Wrapper>
      <TitleDiv>
        <h1>My Collection</h1>
      </TitleDiv>
      {!isAuthenticated ? (
        <LoginDiv>
          <h1>Please login to use this feature</h1>
        </LoginDiv>
      ) : (
        <>
          <CommentSection />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 2px solid red;
  width: 96vw;
  height: 100%;
  margin-top: 10vw;
  position: absolute;
  margin-left: 30px;
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
export default MyCollection;
