import React, {useEffect, useState} from 'react'
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {Divider, List} from "@mui/material";
import MessengerMessagesTwoGroupItem from "./MessengerMessagesTwoGroupItem";
import MessengerMessagesTwoSelectedMessage from "./MessengerMessagesTwoSelectedMessage";
import MenuItem from "@mui/material/MenuItem";



const MessengerMessagesTwo = () => {

    const [allGroups, setAllGroups] = useState([]);
    const [clickedMessage, setClickedMessage] = useState([]);
    const [selectedMenuItemIndex, setSelectedMenuItemIndex] =useState(null);

    useEffect(() => {
        setSelectedMenuItemIndex(0);
        getAllMessageGroups();
    }, [])

    const getAllMessageGroups = () => {
        axios
            .get(`${baseUrl}message-group/non-empty/expand`)
            .then((res) => {
                const data = res.data.data;
                setAllGroups(data);
            })
            .catch(error => {

            })
    }

    const getSelectedGroupMessage = (key) => {
        axios
            .get(`${baseUrl}message-group/${key}/message`)

            .then((res) => {
                setClickedMessage(res.data.data);
            })
            .catch(error => {

            })
    }

    const handleGroupClickCallback = (key) => {
        setClickedMessage([]) // clear selected message
        getSelectedGroupMessage(key);
    }

    const handleSelectedItemCallback = (selectedIndex) => {
        setSelectedMenuItemIndex(selectedIndex);
    }


    const handleGroupDataDisplay = (group, index) => {
        return <MenuItem button divider dense disableGutters key={index} selected={selectedMenuItemIndex === index} style={{whiteSpace: 'normal'}}>
            <MessengerMessagesTwoGroupItem  group={group} index={index} handleGroupClickCallback={handleGroupClickCallback} handleSelectedItemCallback={handleSelectedItemCallback} />
        </MenuItem>
    }


    return <React.Fragment>
        <div className="row">
            <div className="col-md-4">
                New message
            </div>
            <div className="col-md-8">
                search
            </div>
        </div>

        <div className="row">
            <div className="col-md-4">
                {allGroups.length > 0 && <List sx={{height: '500px', maxHeight: '500px', overflow: 'auto', bgColor: 'background.paper'}}>
                    {allGroups.map((g, index) => handleGroupDataDisplay(g, index))}
                </List>}
            </div>
            <div className="col-md-8">
                {clickedMessage.length > 0 && <div style={{height: '500px', maxHeight: '500px', overflow: 'auto'}}><MessengerMessagesTwoSelectedMessage messages={clickedMessage} /></div>}
            </div>
        </div>
    </React.Fragment>
}

export default MessengerMessagesTwo;