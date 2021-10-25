import React, {useEffect, useState} from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./image-cropper.css";



export const ImageCropper = (props) => {
    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();



    useEffect(() => {

        let files=props.files;

        console.log(files)
        if (files[0]){

            setName(files[0].name)


        }

        const reader = new FileReader();

        reader.onload = () => {

            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);


    },[]);


    const onChange = (e) => {

        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;

        } else if (e.target) {
            files = e.target.files;
        }
        console.log(files)
        if (files[0]){

            setName(files[0].name)


        }

        const reader = new FileReader();

        reader.onload = () => {

            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);


    };




    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());


            //base 64 data
            props.setCropData(cropper.getCroppedCanvas().toDataURL(),name)

        }
    };

    return (
        <div>
            <div style={{ width: "100%" }}>

                <Cropper
                    style={{ height: "auto", width: "100%" }}
                    // zoomTo={1}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}

                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    guides={true}
                />


                <button className={" mr-2 btn btn-link blue-btn-border mt-2 btn-blue"} style={{ float: "right" }} onClick={getCropData}>
                    Save Image
                </button>
            </div>
            <div className={"d-none"}>
                <div className="box" style={{ width: "50%", float: "right" }}>
                    <h1>Preview</h1>
                    <h1>{name}</h1>
                    <div
                        className="img-preview"
                        style={{ width: "100%", float: "left", height: "300px" }}
                    />
                </div>
                <div
                    className="box"
                    style={{ width: "50%", float: "right", height: "300px" }}
                >
                    <h1>
                        <span>Crop</span>
                        <button style={{ float: "right" }} onClick={getCropData}>
                            Crop Image
                        </button>
                    </h1>
                    <img style={{ width: "100%" }} src={cropData} alt="cropped" />
                </div>
            </div>
            <br style={{ clear: "both" }} />
        </div>
    );
};

export default ImageCropper;
