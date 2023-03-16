import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from "./ImagesSlider.module.css"; // Import css modules stylesheet as styles
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowCircleDown";
import {MIME_TYPES} from "../../Util/Constants";
import PlaceholderImg from '../../img/place-holder-lc.png';

const Size = "100%"
const ImageDisplayStyle = {
    height: Size,
    maxHeight: Size,
    width: Size,
    maxWidth: Size,
    objectFit: "contain"
}

class ImagesSlider extends React.Component {
    imagesArray = [];

    constructor(props) {
        super(props);
        this.refImg = React.createRef();

        this.state = {
            currentIndex: 0,
        };
    }
    refImg;
    setImages() {
        for (let i = 0; i < this.props.images.length; i++) {
            //
            if (
                this.props.images[i].mime_type === MIME_TYPES.JPEG ||
                this.props.images[i].mime_type === MIME_TYPES.JPG ||
                this.props.images[i].mime_type === MIME_TYPES.PNG
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

    handleIndex = (index) => {
        this.refImg.current.slideToIndex(index);

        this.setState({
            currentIndex: index,
        });
    };

    render() {
        return (
            <>
                <div className="row g-0 bg-white">
                    <div className="col-12 gray-border">
                        {this.imagesArray.length > 0 ? <div>
                            <ImageGallery
                                className={""}
                                ref={this.refImg}
                                showThumbnails={false}
                                thumbnailClass={"custom-gallery-thumbnail"}
                                showNav={false}
                                showPlayButton={false}
                                infinite={false}
                                autoPlay={false}
                                items={this.imagesArray}
                            />
                        </div> : <div className="d-flex justify-content-center align-items-center">
                            <img src={PlaceholderImg} alt="" style={ImageDisplayStyle}/>
                        </div>}
                    </div>
                    {this.imagesArray.length > 1 && <div className={"col-12 "}>
                        <div className={"row g-0 p-2 " + styles.grayBox}>
                            <div className={"col-6 text-left"}>
                                <span className={""}>
                                    {this.state.currentIndex + 1}/{this.imagesArray.length}
                                </span>
                            </div>
                            <div className="col-6 d-flex justify-content-end">
                                <ArrowBackRoundedIcon
                                    className={`turnLeft ${
                                        this.state.currentIndex === 0 && " white-icon"
                                    }`}
                                    onClick={() => {
                                        if (this.state.currentIndex > 0)
                                            this.handleIndex(this.state.currentIndex - 1);
                                    }}
                                />
                                <ArrowBackRoundedIcon
                                    onClick={() => {
                                        if (this.state.currentIndex < this.imagesArray.length - 1)
                                            this.handleIndex(this.state.currentIndex + 1);
                                    }}
                                    className={`turnRight ${
                                        this.state.currentIndex === this.imagesArray.length - 1 &&
                                        " white-icon"
                                    }`}
                                />
                            </div>
                        </div>
                    </div>}
                </div>
            </>
        );
    }
}

export default ImagesSlider;
