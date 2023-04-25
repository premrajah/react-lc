import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import axios from "axios";
import {baseUrl, ENTITY_TYPES} from "../../Util/Constants";


function NotificationsTwoReadAndTracking({item, userDetail}) {

    // console.log('item ', item);

    const [read, setRead] = useState(null)
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

    }, [])

    const getMessage = async (key) => {
        try {
            const result = await axios.get(`${baseUrl}message/${key}`);

            const data = result.data.data;
            const {is_tracked, is_owned} = data.options;
            const {entity_type} = data?.message?.entity_type;

            if(result) {
                // console.log(result.data.data);
                // console.log(result.data.data.options);
                console.log("item ", item)
                console.log("P ", isProduct, "T ", is_tracked, "O ",  is_owned);
                if(item.Message.entity_type === ENTITY_TYPES.PRODUCT) {
                    setIsProduct(true);
                    setIsTracked(is_tracked);
                    setIsOwned(is_owned);
                }

            }

        } catch (e) {
            console.log('get message error ', e);
        }
    }

    return (
        <div className="me-2">
            {(isProduct && isOwned) && isTracked ? <>T</> :<>UT</>}
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