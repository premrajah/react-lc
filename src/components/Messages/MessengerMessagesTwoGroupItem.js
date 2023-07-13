import React, {useEffect, useState} from "react";
import {Chip, ListItem, ListItemText} from "@mui/material";

const MessengerMessagesTwoGroupItem = ({
    group,
    index,userOrg,
    handleGroupClickCallback,
    handleSelectedItemCallback,...props
}) => {


    const [clicked,setClicked]=useState(false);

    useEffect(()=>{

    },[group.unread_count_for_org])
    const handleListItemClick = () => {

        setClicked(true)

        handleSelectedItemCallback(index);
        handleGroupClickCallback(group.message_group._key,true);
    };



    return (
        <React.Fragment key={`group-${group._key}`}>
            <ListItem id={`group-${group._key}`}
                      onClick={() => handleListItemClick(true)} component="div">
                <ListItemText
                    key={`group-lItem-${group._key}`}
                    className={"my-msg-class me-1"}
                    primary={
                        group.orgs.length>0&&(   group.orgs.length > 1 ?
                        group.orgs.filter(item=> item._id!==userOrg).map((org, index) =>
                            <HandleOrgDisplay org={org} index={index} />):
                            group.orgs.map((org, index) =>
                                <HandleOrgDisplay org={org} index={index} />))
                    }
                />

                {group.unread_count_for_org>0&&<span className="new-message-bubble text-14"  >{group.unread_count_for_org}</span>}

            </ListItem>
        </React.Fragment>
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
