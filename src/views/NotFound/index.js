import React, { Component } from 'react';
import { Button, Col, Row, Carousel, CarouselItem, Modal, ModalFooter,ModalDialog, ModalTitle, ModalBody} from 'react-bootstrap'
import { Link} from 'react-router-dom'




class  NotFound extends Component{



    render (){


        return(
            <section className="not-found mb-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h1>404</h1>
                            <h2>Oops! This Page Could Not Be Found</h2>
                            <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
                            <Link to="/" className="red-btn">GO TO HOMEPAGE</Link>
                        </div>

                    </div>
                </div>
            </section>
        )
    }



}





export default NotFound;