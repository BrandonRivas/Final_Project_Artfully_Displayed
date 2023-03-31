import { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";

const NavBar = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLogedin, setIsLogedin] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } =
    useAuth0();

  const handleClick = () => {
    setIsClicked(!isClicked);
    setIsLogedin(false);
  };

  const logoutClick = () => {
    setIsLogedin(!isLogedin);
    setIsClicked(false);
  };

  return (
    <>
      <Container>
        <div>
          <ListTitle onClick={handleClick}>AD</ListTitle>
          <List isClicked={isClicked}>
            <Links to="/" onClick={handleClick}>
              <Li>Home</Li>
            </Links>
            <Links to="/collection" onClick={handleClick}>
              <Li>Search</Li>
            </Links>
            {isAuthenticated && (
              <Links>
                <Li>My Gallery</Li>
              </Links>
            )}
          </List>
        </div>
        <LoginDiv>
          {isLoading ? (
            <Loading />
          ) : !isAuthenticated ? (
            <>
              <LoginButton onClick={() => loginWithRedirect()}>
                Login
              </LoginButton>
            </>
          ) : (
            <UserContainer onClick={logoutClick}>
              <UserInfo>
                {user?.name && <h2>{user.name.split(" ")[0]}</h2>}
                {user?.picture && <Img src={user.picture} />}
              </UserInfo>
              <div>
                <LogoutButton isLogedin={isLogedin} onClick={() => logout()}>
                  logout
                </LogoutButton>
              </div>
            </UserContainer>
          )}
        </LoginDiv>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 96vw;
  position: absolute;
  margin-top: 30px;
  margin-left: 30px;
  /* border: 2px solid red; */
  z-index: 6;
`;
const ListTitle = styled.p`
  font-family: var(--font-headers);
  font-size: 70px;
  opacity: 50%;
  transition: all 500ms cubic-bezier(0.3, 0.1, 0.3, 1);

  @media screen and (max-width: 1800px) {
    font-size: 60px;
  }

  @media screen and (max-width: 1200px) {
    font-size: 50px;
  }

  @media screen and (max-width: 768px) {
    font-size: 40px;
  }

  :hover {
    opacity: 100%;
  }
`;

const List = styled.ul`
  opacity: ${(props) => (props.isClicked ? 1 : 0)};
  visibility: ${(props) => (props.isClicked ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out,
    visibility 0s linear ${(props) => (props.isClicked ? 0 : 0.3)}s;
  position: absolute;
`;

const Links = styled(NavLink)`
  text-decoration: none;
  color: var(--color-old-lace);
`;
const Li = styled.li`
  margin-left: 15px;
  padding-bottom: 10px;
  font-size: 23px;
  opacity: 50%;

  @media screen and (max-width: 1800px) {
    font-size: 20px;
  }

  @media screen and (max-width: 1200px) {
    font-size: 18px;
  }

  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
  :hover {
    text-decoration: underline;
    text-underline-offset: 4px;
    opacity: 100%;
  }
`;

const LoginDiv = styled.div`
  font-size: 30px;
  opacity: 50%;
  transition: all 500ms cubic-bezier(0.3, 0.1, 0.3, 1);
  /* Media query for screens smaller than 1800x994 */
  @media screen and (max-width: 1800px) {
    font-size: 26px;
  }

  @media screen and (max-width: 1200px) {
    font-size: 22px;
  }

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
  :hover {
    opacity: 100%;
  }
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 10px;
`;
const LoginButton = styled.button`
  font-family: var(--font-headers);
  border: 1px solid var(--color-old-lace);
  cursor: pointer;
  background: none;
  padding: 10px 20px;
`;

const LogoutButton = styled.button`
  font-family: var(--font-headers);
  background: none;
  border: 1px solid var(--color-old-lace);
  cursor: pointer;
  position: absolute;
  left: 90vw;
  margin-top: 15px;
  padding: 10px 20px;
  opacity: ${(props) => (props.isLogedin ? 1 : 0)};
  visibility: ${(props) => (props.isLogedin ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out,
    visibility 0s linear ${(props) => (props.isLogedin ? 0 : 0.3)}s;
`;
const UserInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
export default NavBar;
