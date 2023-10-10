import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { baseUrl } from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";
import { saveKey } from "../../LocalStorage/user";


function Magic({ isLoggedIn, userDetail, userContext, loadUserDetail, setUserContext }) {

    const { slug } = useParams();

    const [magicResponse, setMagicResponse] = useState(null);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const getMagic = async () => {
            try {
                axios.get(`${baseUrl}magic/${slug}`)
                    .then((response) => {

                        if (!response.status === 200) {
                            // TODO: show error to user
                        }

                        if (response.status === 419) {
                            // TODO: too many tries
                        }

                        if (response.status === 200) {
                            // TODO: update user context and redirect user
                            console.log("response ", response.data.data);
                            setMagicResponse(response.data.data);
                            let token = response.data.data.user_context.token;
                            setUserContext(response.data.data.user_context);
                            saveKey("token", token);
                            loadUserDetail();
                        }

                        console.error("inside then error ", response.errors);
                    })
                    .catch(error => {
                        console.log("getMagic inside errors ", error, error.message);
                        setErrors(error);
                    })
            } catch (error) {
                console.error("getMagic ", error)
                setErrors(error);
            }
        }
        getMagic();
    }, [slug])

    return (
        <Layout>
            <div className="container">
                <section>
                    Hello {magicResponse && magicResponse.usage_count}
                </section>
            </div>
        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        userContext: state.userContext,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userContext: (data) => dispatch(actionCreator.userContext(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        setUserContext: (data) => dispatch(actionCreator.setUserContext(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Magic);