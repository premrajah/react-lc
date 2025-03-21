import React, { Component } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";

class NotFoundWithoutLayout extends Component {
    render() {
        return (

                <section className="not-found pb-5 mb-5 mt-5 pt-5">
                    <div className="container mt-5 pt-5 mb-5 pb-5   ">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <h1>404</h1>
                                <h2>Oops! This Page Could Not Be Found</h2>
                                <p>
                                    Sorry but the page you are looking for does not exist, has been
                                    moved, name changed or is temporarily unavailable
                                </p>
                                <Link to="/" className="mt-1 btn blue-btn">
                                    HOME
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

        );
    }
}


export default NotFoundWithoutLayout;
