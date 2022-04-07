import React, {useEffect,useState} from "react";
import { Info } from "@mui/icons-material";
import { connect } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";

const OrgFull = (props) => {



    const orgPopover = (
        <Popover id="org-popover">
            <Popover.Title as="h3">
                <span style={{ textTransform: "capitalize" }}>{props.org.name}</span>
            </Popover.Title>
            {props.org.description && (
                <Popover.Content>

                        <p>
                            <span>
                                {props.org.description}
                            </span>
                        </p>

                  <p>Email: {props.org.email }</p>
                </Popover.Content>
            )}
        </Popover>
    );

    if (!props.org) {
        return "";
    }

    return (
        <>
            <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                <div
                    className="mr-1 sub-title-text-pink"
                    style={{
                        textTransform: "capitalize",
                        fontWeight: "700",
                        // color : "#444",
                    }}>
                    {props.org.name}
                </div>
                <OverlayTrigger
                    trigger={ ["hover", "focus"]}
                    placement={"right"}
                    overlay={orgPopover}>
                    <Info
                        style={{ cursor: "pointer", color: "#EAEAEF" }}
                        fontSize={"small"}
                    />
                </OverlayTrigger>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        userDetail: state.userDetail,
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps)(OrgFull);
