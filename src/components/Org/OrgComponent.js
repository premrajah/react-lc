import React, { useEffect, useState } from "react";
import { Info } from "@mui/icons-material";
import { connect } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";

const OrgComponent = (props) => {
    const [org, setOrg] = useState(props.org);

    useEffect(() => {
        if (props.orgId) {
            fetchUserOrg(props.orgId);
        }
    }, []);

    const fetchUserOrg = (org) => {
        axios.get(baseUrl + "" + org).then(
            (response) => {
                setOrg(response.data.data.org);
            },
            (error) => {
                // var status = error.response.status
            }
        );
    };

    const orgPopover = (
        <Popover id="org-popover">
            {org && (
                <div className={"p-3"}>
                    <span className={"title-bold"} style={{ textTransform: "capitalize" }}>
                        {org.name}
                    </span>
                    <br />
                    {org.description && (
                        <>
                            <span className={"text-gray-light  "}>{org.description}</span>
                            <br />
                            <span className={"text-gray-light  "}>
                                Email: <span className={"text-pink"}>{org.email}</span>
                            </span>
                        </>
                    )}
                </div>
            )}
        </Popover>
    );

    // if (!props.org) {
    //     return "";
    // }

    return (
        <>
            {org && (
                <div
                    style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <div
                        className="mr-1 text-gray-light "
                        style={{
                            textTransform: "capitalize",
                            fontWeight: "700",
                            // color : "#444",
                        }}>
                        <span className={props.colorClass ? props.colorClass : "sub-title-text-pink"}> {org.name}</span>
                    </div>
                    <OverlayTrigger
                        trigger={["hover", "focus"]}
                        placement={"bottom"}
                        overlay={orgPopover}>
                        <Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"small"} />
                    </OverlayTrigger>
                </div>
            )}
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

export default connect(mapStateToProps)(OrgComponent);
