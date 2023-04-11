import React, { useState } from "react";
import styled from "styled-components";
import { BiSearchAlt } from "react-icons/bi";
import { MdClear } from "react-icons/md";
const SearchBar = ({ setSearchValue, setRadioButtonSelect, setPage }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [value, setValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const advancedClick = () => {
    setIsClicked(!isClicked);
  };

  const handleClick = () => {
    setSearchValue(value);
    setRadioButtonSelect(selectedFilter);
    setPage(1);
  };
  const searchHandler = (value) => {
    setValue(value);
  };

  const clearClick = () => {
    setValue("");
    setSelectedFilter("");
    setPage(1);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <>
      <Wrapper>
        <SearchBarDiv>
          <SearchDiv>
            <SearchLoop />
            <Input
              type="text"
              placeholder="Search"
              value={value}
              onChange={(ev) => searchHandler(ev.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  handleClick(ev.target.value);
                }
              }}
            />
            <Clear onClick={clearClick} />
          </SearchDiv>
          <Button onClick={handleClick}>search</Button>
          <FilterButton onClick={advancedClick}>Advanced Filters</FilterButton>
        </SearchBarDiv>
        <FilterDiv isClicked={isClicked}>
          <RadioDiv>
            <input
              type="radio"
              id="drawing"
              name="filter"
              value="drawing"
              checked={selectedFilter === "drawing"}
              onChange={handleFilterChange}
            />
            <label htmlFor="drawing">Drawing</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="furniture"
              name="filter"
              value="furniture"
              checked={selectedFilter === "furniture"}
              onChange={handleFilterChange}
            />
            <label htmlFor="furniture">Furniture</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="painting"
              name="filter"
              value="painting"
              checked={selectedFilter === "painting"}
              onChange={handleFilterChange}
            />
            <label htmlFor="painting">Painting</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="paper"
              name="filter"
              value="paper"
              checked={selectedFilter === "paper"}
              onChange={handleFilterChange}
            />
            <label htmlFor="paper">Paper</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="porcelain"
              name="filter"
              value="porcelain"
              checked={selectedFilter === "porcelain"}
              onChange={handleFilterChange}
            />
            <label htmlFor="porcelain">Porcelain</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="sculpture"
              name="filter"
              value="sculpture"
              checked={selectedFilter === "sculpture"}
              onChange={handleFilterChange}
            />
            <label htmlFor="sculpture">Sculpture</label>
          </RadioDiv>
          <RadioDiv>
            <input
              type="radio"
              id="stoneware"
              name="filter"
              value="stoneware"
              checked={selectedFilter === "stoneware"}
              onChange={handleFilterChange}
            />
            <label htmlFor="stoneware">Stoneware</label>
          </RadioDiv>
        </FilterDiv>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.div`
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

const Clear = styled(MdClear)`
  color: var(--color-raisin-black);
  margin-left: 5px;
  margin-right: 10px;
  font-size: 20px;
  padding: 0.5vh;
  cursor: pointer;
  :hover {
    background: var(--color-keppel);
    border-radius: 50%;
  }
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
  border: none;
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
  text-underline-offset: 4px;
  color: var(--color-keppel);
  cursor: pointer;
`;

export default SearchBar;
