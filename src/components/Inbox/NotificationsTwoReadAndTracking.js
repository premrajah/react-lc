import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl, ENTITY_TYPES } from "../../Util/Constants";
import trackIcon from "../../img/track.png";
import unTrackIcon from "../../img/un_track.png";
import { Icon, IconButton } from "@mui/material";
import CustomPopover from "../FormsUI/CustomPopover";

function NotificationsTwoReadAndTracking({ item, userDetail }) {
    // console.log('item ', item);

    const [read, setRead] = useState(null);
    const [isOwned, setIsOwned] = useState(null);
    const [isTracked, setIsTracked] = useState(null);
    const [isProduct, setIsProduct] = useState(null);

    useEffect(() => {
        item && getMessage(item.Message._key);
        // console.log("-> ",userDetail.orgId)
        //     const {orgId} = userDetail;
        //     item.MessageToOrg.map((org, index) => {
        //         if(org.id === orgId) {
        //             // console.log("o ", org)
        //             org.entries.map((entry, index) => {
        //                 // console.log("e ", entry)
        //                 if(entry.MessageToOrg._to === orgId) {
        //                     console.log('rf ', entry.MessageToOrg?.read_flag?.flag);
        //                 }
        //             })
        //         }
        //     })
    }, []);

    const getMessage = async (key) => {
        try {
            const result = await axios.get(`${baseUrl}message/${key}`);

            const data = result.data.data;
            const { is_tracked, is_owned } = data.options;
            const { entity_type } = data?.message?.entity_type;

            if (result) {
                // console.log(result.data.data);
                // console.log(result.data.data.options);
                console.log("item ", item);
                console.log("P ", isProduct, "T ", is_tracked, "O ", is_owned);
                if (item.Message.entity_type === ENTITY_TYPES.PRODUCT) {
                    setIsProduct(true);
                    setIsTracked(is_tracked);
                    setIsOwned(is_owned);
                }
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
                }
            })
            .catch((error) => {
                console.log(`tracking failed ${error}`);
            });
    };

    const unTrackProduct = (productKey) => {
        if (!productKey) return;
        axios
            .delete(`${baseUrl}product/track/${productKey}`)
            .then((res) => {
                if (res.status === 200) {
                    // TODO display message that product is untracked
                }
            })
            .catch((error) => {
                console.log(`un-track failed ${error}`);
            });
    };

    return (
        <div className="me-2">
            {isProduct && isOwned ? <>
                {isTracked ? (
                    <IconButton onClick={() => console.log("untrack")}>
                        <img src={unTrackIcon} alt="ut" height={20} width={20} />
                    </IconButton>
                ) : (
                    <IconButton onClick={() => console.log("track")}>
                        <img src={trackIcon} alt="t" height={20} width={20} />
                    </IconButton>
                )}
            </>: <div style={{width: "36px"}} />}
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
