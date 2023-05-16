import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl, ENTITY_TYPES } from "../../Util/Constants";
import trackIcon from "../../img/track.png";
import unTrackIcon from "../../img/un_track.png";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CustomPopover from "../FormsUI/CustomPopover";

function NotificationsTwoReadAndTracking({ item }) {
    const { _key, entity_type, entity_key } = item?.Message;

    const [isRead, setIsRead] = useState(null);
    const [isOwned, setIsOwned] = useState(null);
    const [isTracked, setIsTracked] = useState(null);
    const [isProduct, setIsProduct] = useState(null);

    useEffect(() => {
        item && getMessage(_key);
    }, []);

    const getMessage = async (key) => {
        try {
            const result = await axios.get(`${baseUrl}message/${key}`);

            const data = result.data.data;
            const { is_tracked, is_owned } = data.options;

            if (result) {
                if (entity_type === ENTITY_TYPES.PRODUCT) {
                    setIsProduct(true);
                    setIsTracked(is_tracked);
                    setIsOwned(is_owned);
                }

                data.orgs.map((org, index) => {
                    if (org.actor === "message_to") {
                        if (org.read_flag?.flag) {
                            setIsRead(org.read_flag.flag);
                        }
                    }
                });
            }
        } catch (e) {
            console.log("get message error ", e);
        }
    };

    const trackProduct = (productEntityKey) => {
        if (!productEntityKey) return;
        const payload = {
            product_id: productEntityKey,
        };

        axios
            .post(`${baseUrl}product/track`, payload)
            .then((res) => {
                if (res.status === 200) {
                    // TODO display message that product is tracked
                    console.log("tracked");
                    setIsTracked(true);
                }
            })
            .catch((error) => {
                console.log(`tracking failed ${error}`);
                setIsTracked(false);
            });
    };

    const unTrackProduct = (productKey) => {
        if (!productKey) return;
        axios
            .delete(`${baseUrl}product/track/${productKey}`)
            .then((res) => {
                if (res.status === 200) {
                    // TODO display message that product is untracked
                    setIsTracked(false);
                    console.log("untracked");
                }
            })
            .catch((error) => {
                console.log(`un-track failed ${error}`);
                setIsTracked(true);
            });
    };

    const markMessageRead = (key) => {
        if (!key) return;

        const payload = {
            msg_id: key,
        };

        axios
            .post(`${baseUrl}message/read`, payload)
            .then(
                (res) => {
                    if (res.status === 200) {
                        //     TODO Notification to user
                        setIsRead(true);
                    }
                },
                (error) => {
                    console.log("mark read internal error ", error);
                    setIsRead(false);
                }
            )
            .catch((error) => {
                console.log("mark read external error ", error);
            });
    };

    return (
        <div className="me-2 d-flex justify-content-center align-items-center">
            <div style={{ width: "36px" }}>
                {isProduct && isOwned ? (
                    <>
                        {isTracked ? (
                            <CustomPopover text="Un-Track">
                                <IconButton onClick={() => unTrackProduct(entity_key)}>
                                    <img src={unTrackIcon} alt="ut" height={20} width={20} />
                                </IconButton>
                            </CustomPopover>
                        ) : (
                            <CustomPopover text="Track">
                                <IconButton onClick={() => trackProduct(entity_key)}>
                                    <img src={trackIcon} alt="t" height={20} width={20} />
                                </IconButton>
                            </CustomPopover>
                        )}
                    </>
                ) : (
                    <div style={{ width: "36px" }} />
                )}
            </div>

            <div style={{ width: "36px" }}>
                {!isRead ? (
                    <CustomPopover text="Mark as read">
                        <IconButton onClick={() => markMessageRead(_key)}>
                            <CheckIcon size="small" sx={{ color: "var(--lc-green)" }} />
                        </IconButton>
                    </CustomPopover>
                ) : (
                    <div style={{ width: "36px" }} />
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsTwoReadAndTracking);
