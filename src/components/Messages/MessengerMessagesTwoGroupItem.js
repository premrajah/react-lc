import React, {useEffect, useState} from "react";
import {Chip, ListItem, ListItemText} from "@mui/material";
import {baseUrl} from "../../Util/Constants";
import axios from "axios";

const MessengerMessagesTwoGroupItem = ({
    group,
    index,userOrg,
    handleGroupClickCallback,
    handleSelectedItemCallback,...props
}) => {


    const [clicked,setClicked]=useState(false);

    useEffect(()=>{

        // alert(group.unread_count_for_org)
    },[group.unread_count_for_org])
    const handleListItemClick = () => {

        setClicked(true)
        markAllRead()
        handleSelectedItemCallback(index);
        handleGroupClickCallback(group.message_group._key,true);
    };

    const markAllRead = () => {

        let url=`${baseUrl}message-group/read`

        axios
            .post(url,{
                msg_group_id: group.message_group._key
            })
            .then((res) => {



            })
            .catch((error) => {

            });



    };


    return (
        <>
            <ListItem id={`group-${group._key}`} key={`group-${group._key}`}
                      onClick={() => handleListItemClick(true)} component="div">
                <ListItemText
                    className={"my-msg-class"}
                    primary={
                        group.orgs.length>0&&(   group.orgs.length > 1 ?
                        group.orgs.filter(item=> item._id!=userOrg).map((org, index) =>
                            <HandleOrgDisplay org={org} index={index} />):
                            group.orgs.map((org, index) =>
                                <HandleOrgDisplay org={org} index={index} />))
                    }
                />

                {group.unread_count_for_org>0&&<span className="new-message-bubble text-14"  >{group.unread_count_for_org}</span>}

            </ListItem>
        </>
    );
};


const HandleOrgDisplay = ({org, index}) => {

    const [orgItem,setOrgItem]=useState(org)
    useEffect(()=>{

        setOrgItem(org)
    },[org])
    return (
        <div

            id={`${index}_${orgItem._ts_epoch_ms}`}
            key={`${index}_${orgItem._ts_epoch_ms}`}>
            {/*<TooltipDisplay org={org}>*/}
            <Chip label={orgItem.name ? orgItem.name : ""} className="mr-1 mb-1 " variant="outlined" />
            {/*</TooltipDisplay>*/}

        </div>
    );
};

export default MessengerMessagesTwoGroupItem;
