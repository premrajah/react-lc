import React from 'react'
import {Link} from "react-router-dom";

const UnableToLoad = () => {
    return (
        <section className="not-found mb-4 mt-5 pt-5">
            <div className="container mt-5 pt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h5>404</h5>
                        <p>Oops! Something went wrong, unable to load</p>
                        <p>Sorry but the information you are looking for does not exist, has been moved, name changed or is temporarily unavailable</p>
                        <Link to="/" className="mt-1 btn-link blue-btn">HOME</Link>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default UnableToLoad;