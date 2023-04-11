import React, { useState } from "react";
import styled from "styled-components";

const Intro = ({
  intro,
  isEditMode,
  user,
  rerender,
  setRerender,
  setError,
}) => {
  //this is to track the new value of the introduction text
  const [text, setText] = useState("");

  //this is the function that will patch the new value of the text input to the mongodb, it will also
  //trigger a re-render
  const handleSumbit = () => {
    fetch(`/intro/${user.sub}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intro: text,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setRerender(!rerender);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to update intro.");
      });
  };
  //this function tracks the changes in the text area and sets it to the text useState
  const handleChange = (event) => {
    setText(event.target.value);
  };
  return (
    <>
      <IntroDiv>
        <IntroP>{intro}</IntroP>
        {isEditMode && (
          <>
            <TextDiv>
              <TextArea
                type="text"
                rows="6"
                cols="100"
                value={text}
                placeholder={intro}
                onChange={handleChange}
              />
              <Submit
                onClick={(event) => {
                  event.preventDefault();
                  handleSumbit();
                }}
              >
                submit
              </Submit>
            </TextDiv>
          </>
        )}
      </IntroDiv>
    </>
  );
};

const IntroDiv = styled.div`
  width: 50%;
  margin-top: 20px;
  margin-bottom: 5px;
  font-size: 20px;
`;

const IntroP = styled.p`
  text-align: center;
  opacity: 75%;
`;

const TextArea = styled.textarea`
  border: none;
  outline: none;
  font-family: var(--font-all);
  color: var(--color-raisin-black);
  background-color: var(--color-old-lace);
  border-radius: 5px;
  margin-top: 10px;
  padding: 10px;
`;

const Submit = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  :hover {
    opacity: 50%;
  }
`;

const TextDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default Intro;
