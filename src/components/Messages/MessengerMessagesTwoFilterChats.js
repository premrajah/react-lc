import React, {useState} from "react";

const MessengerMessagesTwoFilterChats = ({handleFilerCallback}) => {

    const [inputValue, setInputValue] = useState("");

    const filterGroups = (e) => {
        setInputValue(e.target.value);
        handleFilerCallback(inputValue)
    };

    return <div>
        <input
            type="text"
            placeholder="Filter conversations"
            onChange={(e) => filterGroups(e)}
            className="search-input"
            value={inputValue}
        />
    </div>
}

export default MessengerMessagesTwoFilterChats;