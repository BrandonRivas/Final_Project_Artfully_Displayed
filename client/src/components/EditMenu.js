import React, { useState } from "react";
import styled from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";

const EditMenu = ({
  user,
  setFavorite,
  setError,
  setIsEditMode,
  isEditMode,
}) => {
  //this state is to toggle if the menu is hidden or not
  const [hidden, setHidden] = useState(false);

  //this function will delete all the objects in the favorite key of the specific user. it will also 
  //set the states of favorite and error to it's initial states
  const deleteAll = () => {
    fetch(`/mycollection/${user.sub}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setFavorite([]);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to delete all.");
      });
  };


//this is the function that will toggle the state to display the garbage cans in MyCollection
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

// this function will show menu after clicking the hamburger icon. if you click it again
//it will also hide the edit features
  const showMenu = () => {
    setHidden(!hidden);
    setIsEditMode(false);
  };

  return (
    <>
      <ButtonDiv hidden={hidden}>
        <Edit onClick={handleEditClick}>Edit</Edit>
        <DeleteAllButton onClick={deleteAll}>Delete All</DeleteAllButton>
      </ButtonDiv>
      <MenuDiv>
        <Menu onClick={showMenu} />
      </MenuDiv>
    </>
  );
};

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
  :hover {
    opacity: 50%;
  }
`;
const DeleteAllButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  :hover {
    opacity: 50%;
  }
`;

export default EditMenu;
