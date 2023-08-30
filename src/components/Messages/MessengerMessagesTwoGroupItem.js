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
        <React.Fragment key={`group-mgm-${index}`}>
            <div id={`group-rm-${index}`} key={`group-dm-${index}`}
                      onClick={(e) =>{
                          e.preventDefault();
                          e.stopPropagation();
                          handleListItemClick(true)} }>
                <div key={`group-lItem-${group._key}`}
                    className={"my-msg-class me-1 d-flex"}>
                    {group.orgs.length>0&&(   group.orgs.length > 1 ?
                            group.orgs.filter(item=> item._id!==userOrg).map((org, ind) =>
                                <React.Fragment key={`group-m-${ind}`}>
                                    <HandleOrgDisplay org={org} index={ind} />
                                </React.Fragment>):
                            group.orgs.map((org, ind) =>
                                <React.Fragment key={`group-m-${ind}`}>
                                <HandleOrgDisplay org={org} index={ind} />)
                                </React.Fragment>))
                    }

                </div>

                {group.unread_count_for_org>0&&<span className=" new-message-bubble  text-14"  >{group.unread_count_for_org}</span>}

            </div>
        </React.Fragment>
    );
};


const HandleOrgDisplay = ({org, index}) => {

    const [orgItem,setOrgItem]=useState(org)
    useEffect(()=>{

        setOrgItem(org)
    },[org])
    return (

        <div className="m-1" id={`${index}-${orgItem._ts_epoch_ms}`}>

            <Chip label={orgItem.name ? orgItem.name : ""} className="mr-1  " variant="outlined" />


        </div>
    );
};

export default MessengerMessagesTwoGroupItem;
