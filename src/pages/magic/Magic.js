import React from 'react'
import { connect } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function Magic({ isLoggedIn, userDetail, userContext }) {
    
    const location = useLocation();
    const params = new URLSearchParams(location?.search);
    const path = location.pathname;
    const queryCode = params?.get("c");
    console.log("> ", path);

    return (
        <Layout>
            <div className="container">
                <section>
                    Hello {queryCode && queryCode}
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Magic);