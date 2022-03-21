import React, { Component } from "react";
import UnableToLoad from "./UnableToLoad";

class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error:null
    };

    static getDerivedStateFromError(error) {

        return {
            hasError: true,
        };
    }

    componentDidCatch(error, info) {

        console.log(error)


    }

    render() {
        if (this.state.hasError) {

            return this.props.skip?<></>:<UnableToLoad />;
        }


        return this.props.children;
    }
}

export default ErrorBoundary;
