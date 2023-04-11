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
  const [hidden, setHidden] = useState(false);
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

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

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
