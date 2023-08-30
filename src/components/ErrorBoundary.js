import React, { Component } from "react";
import UnableToLoad from "./UnableToLoad";
import axios from "axios";
import {baseUrl} from "../Util/Constants";

class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error:null
    };

    static getDerivedStateFromError(error) {

        return {
            hasError: true,
            error:error
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.error){
            
        }
    }

    

    logError=() =>{

        axios
            .post(baseUrl + "product/" + this.state.item.product._key + "/archive", {})
            .then((res) => {
                this.props.showSnackbar({show:true,severity:"success",message:"Product is move to archive successfully. Thanks"})

            })
            .catch((error) => {


                // this.setState({
                //
                //     errorRegister:error.response.data.errors[0].message
                // })
            });
    }

    render() {
        if (this.state.hasError) {


            return this.props.skip?<></>:<UnableToLoad error={this.state.error} />;
        }


        return this.props.children;
    }
}





export default ErrorBoundary;
