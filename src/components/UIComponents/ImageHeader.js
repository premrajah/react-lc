import React ,{Component } from 'react';
import PlaceholderImg from "../../img/place-holder-lc.png";

import ImagesSlider from "../ImagesSlider/ImagesSlider";

class ImageHeader extends Component{



    render (){

        const images=this.props.images
        return(
            <>

            {images.length > 0 ? (
                    <ImagesSlider images={images} />
                ) : (
                    <img
                        className={"img-fluid bg-white rad-8 bg-white p-2"}
                        src={PlaceholderImg}
                        alt=""
                    />
                )}
         </>

        )    }
}


export default ImageHeader;

