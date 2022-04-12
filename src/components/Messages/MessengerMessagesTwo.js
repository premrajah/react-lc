import React, {useEffect, useState} from 'react'
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {Divider, List} from "@mui/material";
import MessengerMessagesTwoGroupItem from "./MessengerMessagesTwoGroupItem";



const MessengerMessagesTwo = () => {

    const [allGroups, setAllGroups] = useState([]);

    useEffect(() => {
        getAllMessageGroups();
    }, [])

    const getAllMessageGroups = () => {
        axios
            .get(`${baseUrl}message-group/non-empty/expand`)
            .then((res) => {
                const data = res.data.data;
                console.log('> ', data)
                setAllGroups(data);
            })
            .catch(error => {

            })
    }

    const getSelectedGroupMessage = (key) => {
        axios
            .get(`${baseUrl}message-group/${key}/message`)

            .then((res) => {
                console.log('sele ', res.data.data)
            })
            .catch(error => {

            })
    }


    const handleGroupDataDisplay = (groups, index) => {


        return <MessengerMessagesTwoGroupItem key={index} groups={groups} index={index} />

    }

    // {group.message_group.name.replaceAll("+", ", ")}

    return <React.Fragment>
        <div className="row">
            <div className="col-md-4">
                {allGroups.length > 0 && <List sx={{height: '500px', maxHeight: '500px', overflow: 'auto', bgColor: 'background.paper'}}>
                    {allGroups.map((g, index) => handleGroupDataDisplay(g, index))}
                </List>}
            </div>
            <div className="col-md-8">
                2
            </div>
        </div>
    </React.Fragment>
}

export default MessengerMessagesTwo;