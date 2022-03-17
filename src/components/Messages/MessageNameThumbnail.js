import React from "react";
import {Tooltip} from "@mui/material";
import {randomColorGen} from "../../Util/Constants";
import CustomPopover from "../FormsUI/CustomPopover";

const MessageNameThumbnail = ({ item, allOrgs, index ,showCount}) => {
    return (
        <React.Fragment>
            {(index < showCount) && (
                <CustomPopover  text={item.name}>
                    <span
                        className={`text-caps company-thumbnails ${
                            index > 0 && "thumbnail-margin-left"
                        } `}>
                        {item.name && item.name.substr(0, 2)}
                    </span>
                </CustomPopover>
            )}

            {index === showCount && allOrgs.length - showCount !== 0 && (
                <span className="more-items-thumbnail">+{allOrgs.length - showCount}</span>
            )}
        </React.Fragment>
    );
};

export default MessageNameThumbnail;
