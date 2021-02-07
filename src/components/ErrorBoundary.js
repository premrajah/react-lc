import React, { Component } from "react";
import UnableToLoad from "./UnableToLoad";

class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(error) {
        return {
            hasError: true
        }
    }

    componentDidCatch(error, info) {


    }

    render() {
        if (this.state.hasError) {
            return <UnableToLoad />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
