import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from './image-slider.css'; // Import css modules stylesheet as styles

import  ArrowBackRoundedIcon from '@mui/icons-material/ArrowCircleDown';

class ImagesSlider extends React.Component {
    imagesArray = [];

    constructor(props) {
        super(props);
    }

    setImages() {
        for (let i = 0; i < this.props.images.length; i++) {
            //
            if (
                this.props.images[i].mime_type === "image/jpeg" ||
                this.props.images[i].mime_type === "image/png"
            ) {
                this.imagesArray.push({
                    original: this.props.images[i].blob_url,
                    thumbnail: this.props.images[i].blob_url,
                });
            }
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.imagesArray = [];

        this.setImages();
    }

    UNSAFE_componentWillMount() {
        this.imagesArray = [];

        this.setImages();
    }

    render() {
        return (
            <>
            <ImageGallery
                showThumbnails={false}
                thumbnailClass={"custom-gallery-thumbnail"}
                showNav={true}
                showPlayButton={false}
                infinite={true}
                autoPlay={false}
                items={this.imagesArray}
            />
            <div className={"row image-gallery-bottom"}>
                <div className={"col-6"}>


                </div>
                <div className={"col-6"}>

                    <ArrowBackRoundedIcon className={styles.turnLeft}  />
                    <ArrowBackRoundedIcon className={styles.turnRight} />

                </div>

            </div>
                </>
        );
    }
}

export default ImagesSlider;
