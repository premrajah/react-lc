import React, {useState} from "react";

const MessengerMessagesTwoFilterChats = ({handleFilerCallback}) => {


    const filterGroups = (e) => {
        const { value } = e.target;
        handleFilerCallback(value)
    };

    return <div>
        <input
            placeholder="Filter conversations"
            onChange={(e) => filterGroups(e)}
            className="search-input"
        />
    </div>
}

export default MessengerMessagesTwoFilterChats;