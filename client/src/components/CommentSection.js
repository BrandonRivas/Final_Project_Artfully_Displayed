import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

const CommentSection = ({ isEditMode }) => {
  //this state will contain the fetched comments from the db
  const [comments, setComments] = useState();
  //this are the states from auth0
  const { user, isLoading } = useAuth0();
  //this state tracks the value of the input area
  const [text, setText] = useState("");
  //this is to re-render the comment section after posting
  const [posted, setPosted] = useState(false);

  //this will fetch and set the comments from the dp
  useEffect(() => {
    fetch("/comments")
      .then((response) => response.json())
      .then((data) => {
        setComments(data.data);
      });
  }, [setComments, posted]);

  //when the user clicks the post button it will post it to the db and re-set the default values of the states
  const handleClick = () => {
    fetch("/comments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: text,
        imageSrc: user.picture,
        user: user.name,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setText("");
        setPosted(!posted);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //this is to set the text value from the text area input
  const handleChange = (event) => {
    setText(event.target.value);
  };

  //this will delete a comment from the db based on it's id
  const handleDelete = (id) => {
    fetch(`/comments/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setPosted(!posted);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      {!comments ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : (
        <div>
          <CommentWrapper>
            <H2>Comment Section</H2>
            {comments.map((info) => {
              return (
                <CommentsDiv key={info._id}>
                  <Img src={info.imageSrc} alt={`${info.user} user icon`} />
                  <TextDiv>
                    <UserName>{info.user}</UserName>
                    <Comment>{info.comment}</Comment>
                  </TextDiv>
                  {isEditMode && (
                    <DeleteButton onClick={() => handleDelete(info._id)}>
                      x
                    </DeleteButton>
                  )}
                </CommentsDiv>
              );
            })}
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <InputWrapper>
                  {user?.picture && <Img src={user.picture} />}
                  <CommentInputDiv>
                    {user?.name && <h2>{user.name.split(" ")[0]}</h2>}
                    <Input
                      type="text"
                      rows="6"
                      cols="55"
                      placeholder="What do you think about this collection?"
                      value={text}
                      onChange={handleChange}
                    />
                    <ButtonDiv>
                      <Button onClick={handleClick}>Post</Button>
                    </ButtonDiv>
                  </CommentInputDiv>
                </InputWrapper>
              </>
            )}
          </CommentWrapper>
        </div>
      )}
    </div>
  );
};

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CommentsDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  opacity: 75%;
`;

const Comment = styled.p`
  width: 40vw;
`;
const InputWrapper = styled.div`
  display: flex;
  margin-top: 10px;
`;

const CommentInputDiv = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
`;
const TextDiv = styled.div`
  margin-left: 10px;
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-old-lace);
`;

const UserName = styled.p`
  font-family: var(--font-headers);
`;

const Input = styled.textarea`
  border: none;
  outline: none;
  font-family: var(--font-all);
  color: var(--color-raisin-black);
  background-color: var(--color-old-lace);
  border-radius: 5px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  :hover {
    opacity: 50%;
  }
`;

const DeleteButton = styled.button`
  opacity: 20%;
  transition: opacity 0.3s ease-in-out;
  margin-left: 10px;

  :hover {
    opacity: 1;
  }
`;

const H2 = styled.h2`
  opacity: 50%;
  font-size: 25px;
`;
export default CommentSection;
