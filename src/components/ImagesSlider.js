import React from "react";
import ImageGallery from 'react-image-gallery';
import  "react-image-gallery/styles/css/image-gallery.css";

class ImagesSlider extends React.Component {

     imagesArray = []

    constructor(props) {
        super(props);

    }



    componentWillMount() {


        for (let i = 0; i < this.props.images.length; i++) {


            // console.log(props.images[i])
            this.imagesArray.push(
                {
                    original:  this.props.images[i],
                    thumbnail:  this.props.images[i],

                }
            )

        }

    }
    componentWillUnmount() {
    }



    render() {
        return (


            <ImageGallery ori thumbnailClass={"custom-gallery-thumbnail"}  showNav={false} showPlayButton={false} infinite={true}  autoPlay={false} items={this.imagesArray}  />

        );
    }
}



export default ImagesSlider;