import React, { useState } from "react";
import styled from "styled-components";
import { BiSearchAlt } from "react-icons/bi";
const SearchBar = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [value, setValue] = useState("");

  const advancedClick = () => {
    setIsClicked(!isClicked);
  };

  const handleClick = () => {
    setValue("");
  };
  const searchHandler = (value) => {
    setValue(value);
  };

  
  console.log(value)
  return (
    <>
      <Warapper>
        <SearchBarDiv>
          <SearchDiv>
            <SearchLoop />
            <Input
              type="text"
              placeholder="Search"
              value={value}
              onChange={(ev) => searchHandler(ev.target.value)}
            />
          </SearchDiv>
          <Button onClick={handleClick}>search</Button>
          <FilterButton onClick={advancedClick}>Advances Filters</FilterButton>
        </SearchBarDiv>
        <FilterDiv isClicked={isClicked}>
          <RadioDiv>
            <input type="radio" id="drawing" name="filter" value="drawing" />
            <label htmlFor="drawing">Drawing</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="furniture"
              name="filter"
              value="furniture"
            />
            <label htmlFor="furniture">Furniture</label>
          </RadioDiv>
          <RadioDiv>
            <input type="radio" id="painting" name="filter" value="painting" />
            <label htmlFor="painting">Painting</label>
          </RadioDiv>
          <RadioDiv>
            <input type="radio" id="paper" name="filter" value="paper" />
            <label htmlFor="paper">Paper</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="porcelain"
              name="filter"
              value="porcelain"
            />
            <label htmlFor="porcelain">Porcelain</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="sculpture"
              name="filter"
              value="sculpture"
            />
            <label htmlFor="sculpture">Sculpture</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="stoneware"
              name="filter"
              value="stoneware"
            />
            <label htmlFor="stoneware">Stoneware</label>
          </RadioDiv>
        </FilterDiv>
      </Warapper>
    </>
  );
};
const Warapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SearchBarDiv = styled.div`
  display: flex;
  align-items: center;
`;
const SearchDiv = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  width: 50vw;
  height: 5vh;
  background-color: var(--color-old-lace);
`;
const FilterDiv = styled.div`
  display: flex;
  opacity: ${(props) => (props.isClicked ? 1 : 0)};
  visibility: ${(props) => (props.isClicked ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out,
    visibility 0s linear ${(props) => (props.isClicked ? 0 : 0.3)}s;
`;
const RadioDiv = styled.div`
  margin-right: 10px;
  margin-top: 10px;
`;
const SearchLoop = styled(BiSearchAlt)`
  color: var(--color-raisin-black);
  margin-left: 10px;
  margin-right: 3px;
  font-size: 20px;
`;
const Input = styled.input`
  width: 45vw;
  height: 3vh;
  border: none;
  background-color: var(--color-old-lace);
  color: var(--color-raisin-black);
`;
const Button = styled.button`
  padding: 1.5vh 2vw;
  border-radius: 10px;
  border: none;
  background-color: var(--color-burnt-orange);
  font-size: 15px;
  margin-left: 7px;
  margin-right: 7px;
  cursor: pointer;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  text-decoration: underline;
  color: var(--color-keppel);
  cursor: pointer;
`;

export default SearchBar;
