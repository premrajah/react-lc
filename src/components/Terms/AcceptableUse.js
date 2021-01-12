import React from 'react'
import {Link} from 'react-router-dom'

const AcceptableUse = ({header, footer}) => {
    return(
        <div>
            {header}
            <div className="container" style={{marginTop: '100px'}}>

                <div className="row mt-5 mb-5">
                    <div className="col">
                        <Link to="/" className="btn btn-green">
                            Home
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <h2>Acceptable Use Policy</h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 mt-5">
                        <Link to="/" className="btn btn-green">Home</Link>
                    </div>
                </div>
            </div>
            {footer}
        </div>
    )
}

export default AcceptableUse