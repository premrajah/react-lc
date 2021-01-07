import React, { Component } from 'react';
import { Link} from 'react-router-dom'
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'



class  NotFound extends Component{



    render (){


        return(


            <>

                <Sidebar />
                <HeaderDark />
            <section className="not-found mb-4 mt-5 pt-5">
                <div className="container mt-5 pt-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h1>404</h1>
                            <h2>Oops! This Page Could Not Be Found</h2>
                            <p>Sorry but the page you are looking for does not exist, has been moved, name changed or is temporarily unavailable</p>
                            <Link to="/" className="mt-1 btn blue-btn">HOME</Link>
                        </div>

                    </div>
                </div>
            </section>

                </>
        )
    }



}





export default NotFound;