import React from "react";
import { Link } from "react-router-dom";
import BlueBorderLink from "./FormsUI/Buttons/BlueBorderLink";

const UnableToLoad = () => {
    return (
        <section className="not-found ">
            <div className="container ">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/*<h5>404</h5>*/}
                        <p>Oops! Something went wrong, unable to load</p>
                        <p>
                            Sorry but the information you are looking for does not exist, has been
                            moved, name changed or is temporarily unavailable
                        </p>
                        <BlueBorderLink to="/" className="mt-1 btn-link blue-btn" title={"Reload"}>

                        </BlueBorderLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UnableToLoad;
