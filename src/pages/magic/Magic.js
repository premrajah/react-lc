import React from 'react'
import {connect} from "react-redux";

function Magic({isLoggedIn, userDetail}) {
    
  return (
    <div>Magic</div>
  )
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

export default connect(mapStateToProps, mapDispatchToProps)(Magic);