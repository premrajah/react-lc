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
                        className={"img-fluid"}
                        src={PlaceholderImg}
                        alt=""
                    />
                )}
         </>

        )    }
}


export default ImageHeader;

