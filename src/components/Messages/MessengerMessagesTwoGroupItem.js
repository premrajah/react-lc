import React, {useEffect, useState} from "react";
import { Chip, Divider, ListItem, ListItemText } from "@mui/material";
import OrgComponent from "../Org/OrgComponent";
import TooltipDisplay from "../Org/TooltipDisplay";

const MessengerMessagesTwoGroupItem = ({
    group,
    index,userOrg,
    handleGroupClickCallback,
    handleSelectedItemCallback,...props
}) => {


    const handleListItemClick = () => {
        console.log("handle click")
        handleSelectedItemCallback(index);
        handleGroupClickCallback(group.message_group._key);
    };

    return (
        <>
            <ListItem id={`group-${group._key}`} key={`group-${group._key}`} onClick={() => handleListItemClick()} component="div">
                <ListItemText

                    className={"my-msg-class"}
                    primary={
                        group.orgs.length > 0 &&
                        group.orgs.filter(item=> item._id!=userOrg).map((org, index) => <HandleOrgDisplay org={org} index={index} />)
                    }
                />

            </ListItem>
        </>
    );
};


const HandleOrgDisplay = ({org, index}) => {

    const [orgItem,setOrgItem]=useState(org)
    useEffect(()=>{

        console.log("changed org name")
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
