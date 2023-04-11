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
  const [text, setText] = useState("");

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
  const handleChange = (event) => {
    setText(event.target.value);
  };
  return (
    <>
      <IntroDiv>
        <IntroP>{intro}</IntroP>
        {isEditMode && (
          <>
            <TextArea
              type="text"
              rows="6"
              cols="135"
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
`;

const Submit = styled.button`
  padding: 10px 20px;
  :hover {
    opacity: 50%;
  }
`;
export default Intro;
