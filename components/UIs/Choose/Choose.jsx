import { useState, useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";
// STYLES FILES
import cls from "./choose.module.scss";

const Choose = ({ placeholder, results, choose, value, disabled, keyword }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredResults, setFilteredResults] = useState(results);
  const inputRef = useRef();
  const { i18n } = useTranslation();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    setFilteredResults(results);
  }, [results]);

  // FILTER RESULTS WITH TYPING
  const filterResults = (typed) => {
    setInputValue(typed);
    if (typed !== "") {
      let filtered = filteredResults.filter((result) =>
        result[keyword].toLowerCase().startsWith(typed.toLowerCase())
      );

      if (filtered.length !== 0) {
        setFilteredResults(filtered);
      } else {
        setFilteredResults(results);
      }
    } else {
      setFilteredResults(results);
    }
  };

  // SELECT CHOOSE OPTION HANDLER
  const selectChoose = (result) => {
    choose(result);
    setOpen(false);
    setFilteredResults(results);
    inputRef.current.id = result.id;
  };

  return (
    <>
      {open && (
        <div className={cls.overlay} onClick={() => setOpen(false)}></div>
      )}

      <div className={cls.field}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => filterResults(e.target.value)}
          onFocus={() => setOpen(true)}
          disabled={disabled}
        />
        <i className={`fa-solid fa-angle-down ${cls[i18n.language]}`}></i>

        <div className={`${cls.field__results} ${open ? cls.active : ""}`}>
          <div className={cls.field__results_result}>
            {filteredResults.map((result) => (
              <div
                className={cls.resultInside}
                onClick={() => selectChoose(result)}
                key={result.option}
              >
                <p key={result}>{result.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Choose;
