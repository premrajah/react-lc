import React from "react";
import { Link } from "react-router-dom";
import BlueBorderLink from "./FormsUI/Buttons/BlueBorderLink";
import {REACT_APP_BRANCH_ENV} from "../Util/Constants";

const UnableToLoad = (props) => {
    return (
        <section className="not-found ">
            <div className="container ">
                <div className="row d-flex align-items-center min-vh-80 justify-content-center">
                    <div className="col-lg-8">
                        {/*<h5>404</h5>*/}
                        <p>Oops! Something went wrong, unable to load</p>
                        <p>
                            Sorry but the information you are looking for does not exist, has been
                            moved, name changed or is temporarily unavailable
                        </p>

                        {REACT_APP_BRANCH_ENV!=="master" &&  <p><span className="text-bold border-red-error">Error: </span>{props.error.toString()} </p>}
                        <a href={`${window.location.pathname}`} className="mt-1 btn-link blue-btn"
                                        title={"Reload"}>
                            Reload

                        </a>
<br/>
                        <br/>
                        <BlueBorderLink to={`/`} className="mt-2 btn-link blue-btn" title={"Go To Homepage"}>
                        </BlueBorderLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UnableToLoad;
