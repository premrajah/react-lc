import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { baseUrl } from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";


function Magic({ isLoggedIn, userDetail, userContext, loadUserDetail, setUserContext, showSnackbar }) {

    const { slug } = useParams();
    const history = useHistory();

    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const getMagic = async () => {
            try {
                axios.get(`${baseUrl}magic/${slug}`)
                    .then((response) => {

                        if (response.status === 200) {
                            const { data } = response.data

                            const { user_context } = data;
                            const { token } = user_context;
                            const { destination_path } = data;

                            let newURL = destination_path.replace(/^.*\/\/[^\/]+/, '');

                            setUserContext({ token, "user": user_context });
                            showSnackbar({show: true, severity: "success",message: "Successfully logged In"});
                            history.push(newURL);

                        }

                    })
                    .catch(error => {
                        console.log("getMagic inside errors ", error);
                        setErrors(error);
                        showSnackbar({show: true, severity: "error",message: "Something went wrong, link not valid"});
                    })
            } catch (error) {
                console.error("getMagic outside catch error ", error)
                setErrors(error);
                showSnackbar({show: true, severity: "error",message: "Something went wrong, link not valid"});
            }
        }
        getMagic();
    }, [history, setUserContext, showSnackbar, slug])

    return (
        <Layout>
            <div className="container">
                <section className="mt-4">
                    {errors && <div>
                        <div className="text-danger">{errors?.message ?? "Apologies, The link has expired. Please contact Admin"}</div>
                        <ul className="list-group">
                            <li className="list-group-item p-2">
                                Error status code <span className="text-danger">404</span> The link is not valid or missing characters.
                            </li>
                            <li className="list-group-item p-2">
                                Error status code <span className="text-danger"> 409</span> The link is not valid or has expired.
                            </li>
                        </ul>
                    </div>}
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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Magic);