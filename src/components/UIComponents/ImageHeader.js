import React, { Component } from "react";
import PlaceholderImg from "../../img/place-holder-lc.png";
import ImagesSlider from "../ImagesSlider/ImagesSlider";

class ImageHeader extends Component {
    render() {
        const images = this.props.images;
        return (
            <>
                {images.length > 0 ? (
                    <ImagesSlider images={images} />
                ) : (
                    <div className="col-12 p-2 gray-border rad-8 bg-white ">
                        <img
                            className="img-fluid placeholder-img  rad-8 bg-white "
                            src={PlaceholderImg}
                            alt=""
                        />
                    </div>
                )}
            </>
        );
    }
}

export default ImageHeader;
