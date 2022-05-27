import React, {useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";

const MessengerMessagesTwoFilterChats = ({handleFilerCallback, handleClearInputCallback}) => {

    const [inputValue, setInputValue] = useState("");

    const filterGroups = (e) => {
        setInputValue(e.target.value);
        handleFilerCallback(e.target.value)
    };

    const handleClearFilterInput = () => {
        setInputValue("");
        handleClearInputCallback(true);
    };

    return <>
        <div className="">
            <input
                type="text"
                placeholder="Filter conversations"
                onChange={(e) => filterGroups(e)}
                className="search-input"
                value={inputValue}
            />
        </div>
        <div
            className="d-flex justify-content-start align-items-center"
            onClick={() => handleClearFilterInput()}>
            {inputValue.length > 0 && <ClearIcon/>}
        </div>
    </>
}

export default MessengerMessagesTwoFilterChats;