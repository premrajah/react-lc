import React from "react";
import {Tooltip} from "@mui/material";
import {randomColorGen} from "../../Util/Constants";

const MessageNameThumbnail = ({ item, allOrgs, index }) => {
    return (
        <React.Fragment>
            {index < 3 && (
                <Tooltip title={<React.Fragment>
                    <div>{item.name && item.name}</div>
                    <div>{item.email && item.email}</div>
                </React.Fragment>}>
                    <span
                        style={{color: randomColorGen()}}
                        className={`text-caps company-thumbnails ${
                            index > 0 && "thumbnail-margin-left"
                        } `}>
                        {item.name && item.name.substr(0, 2)}
                    </span>
                </Tooltip>
            )}

            {index === 3 && allOrgs.length - 3 !== 0 && (
                <span className="more-items-thumbnail">+{allOrgs.length - 3}</span>
            )}
        </React.Fragment>
    );
};

export default MessageNameThumbnail;
