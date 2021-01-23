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
                    original:  this.props.images[i].blob_url,
                    thumbnail:  this.props.images[i].blob_url,

                }
            )

        }

    }
    componentWillUnmount() {
    }



    render() {
        return (


            <ImageGallery showThumbnails={false}  thumbnailClass={"custom-gallery-thumbnail"}  showNav={true} showPlayButton={false} infinite={true}  autoPlay={false} items={this.imagesArray}  />

        );
    }
}



export default ImagesSlider;