import React, {Component} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";

class TestRoute extends Component {


    constructor(props) {
        super(props);

    }


    componentDidMount() {


        axios.post(`${baseUrl}hello`, {
            url:window.location.href

        }).catch((error) => {
            console.error(error);
            return "Unknown error occurred.";
        });
    }

    render() {
        return (
            <>


            </>
        );
    }
}


const mapStateToProps = (state) => {
    return {


    };
};

const mapDispachToProps = (dispatch) => {
    return {

    };
};
export default connect(mapStateToProps, mapDispachToProps)(TestRoute);
