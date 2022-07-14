import React, { useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const DevelopmentUserInfoDisplay = ({ userDetail }) => {
    const [showHideDisplay, setShowHideDisplay] = useState(false);

    const handleShowHideDisplay = () => {
        setShowHideDisplay(!showHideDisplay);
    };

    return (
        <>
            <div
                className="position-fixed"
                style={{
                    width: "25px",
                    height: "140px",
                    top: "65px",
                    left: "0",
                    zIndex: "99991",
                    borderBottom: "1px solid var(--lc-purple)"
                }}
                onClick={() => handleShowHideDisplay()}>
                {showHideDisplay ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </div>
            {showHideDisplay && (
                <div
                    className="position-fixed p-1"
                    style={{
                        width: "260px",
                        height: "140px",
                        border: "1px solid rgba(0,0,0,0.5)",
                        backgroundColor: "rgba(237, 237, 237, 0.8)",
                        borderRadius: "4px",
                        top: "65px",
                        left: "25px",
                        color: "var(--lc-purple)",
                        zIndex: "9999",
                        overflow: "hidden",
                    }}>
                    <div>
                        User: <b>{userDetail && userDetail.orgId}</b>
                    </div>
                    <div>
                        Email: <b>{userDetail && userDetail.email}</b>
                    </div>
                    <div>
                        IsOrgAdmin: {userDetail && userDetail.is_org_admin ? <b>Yes</b> : "No"}
                    </div>
                    <div>
                        IsLoopcycleAdmin:{" "}
                        {userDetail && userDetail.is_loopcycle_admin ? <b>Yes</b> : "No"}
                    </div>
                </div>
            )}
        </>
    );
};

export default DevelopmentUserInfoDisplay;
