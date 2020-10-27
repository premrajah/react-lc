import React, { Component } from 'react';
import './upload-file.css'
import  {Cancel} from '@material-ui/icons';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


class UploadFileBootStrap extends Component {
    constructor(props){
        super(props)
        this.state = {
            files: [],
            filesUrl: [],
            imageIndexLightBox : 0,
            openLightBox : false
        }
        this.handleChange = this.handleChange.bind(this)
    }


    handleClickOutside = event => {

        // alert("click")
        console.log(event.target)

        // if (event.target.className=="file-upload-img-thumbnail-cancel"&&event.target.className!="country-dropdown-a-list-item") {
        //
        //     this.setState({cityDropDown: false});
        //
        // }
        // alert("clciekd")


        if (event.target.className!="file-upload-img-thumbnail-cancel") {

            // alert("hello")

            this.setState({openLightBox: false});

        }else{
            // alert("no")
        }

    }



    componentDidMount () {

        window.scrollTo(0, 0)
        document.addEventListener('click', this.handleClickOutside, true);
    }



        handleChange(event) {

            console.log(event.target.files)

            var files = []
            var filesUrl = []


            // if (event.target.files) {
            //
            //     alert("here")

                for (var i = 0; i < event.target.files.length; i++) {


                    files.push(event.target.files[i])
                    filesUrl.push(URL.createObjectURL(event.target.files[i]))

                    console.log(URL.createObjectURL(event.target.files[i]))

                }

                this.setState({
                    files: files,
                    filesUrl: filesUrl
                })
            // }
        }

    handleLightBox(e){

        var index = e.currentTarget.dataset.index;

        console.log("image selected "+index)


            this.setState({

                imageIndexLightBox : index,
                openLightBox : false
            })


    }

    handleCancel(e){


        e.preventDefault()

        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
        var url = e.currentTarget.dataset.url;

        console.log("image selected "+index)


        var files = this.state.files.filter((item) => item.name != name)
        var filesUrl = this.state.filesUrl.filter((item) => item.url!=url)



        this.setState({

            files : files,
            filesUrl : filesUrl
        })



    }
    render() {
        return (
            <>
            <div onClick={this.handleChange} className={"file-uploader-box"}>
                <input className={""} multiple type="file" onChange={this.handleChange}/>
                <div className={"file-uploader-img-container"}>

                {this.state.files && this.state.files.map((item,index)=>

                    <div className={"file-uploader-thumbnail-container"}>

                        {/*<img src={URL.createObjectURL(item)}/>*/}
                        <div   data-index={index} data-url={URL.createObjectURL(item)}

                                  onClick={this.handleLightBox.bind(this)} className={"file-uploader-thumbnail"} style={{backgroundImage:"url("+URL.createObjectURL(item)+ ")"}}>
                            <Cancel data-name={item.name} data-index={index} onClick={this.handleCancel.bind(this)} className={"file-upload-img-thumbnail-cancel"}/>
                        </div>
                    </div>

                )}

                </div>

            </div>



                {this.state.openLightBox && (
                    <Lightbox
                        mainSrc={(this.state.filesUrl[this.state.imageIndexLightBox])}
                        nextSrc={this.state.filesUrl[(this.state.imageIndexLightBox + 1) % this.state.files.length]}
                        prevSrc={this.state.filesUrl[(this.state.imageIndexLightBox - 1) % this.state.files.length]}
                        onCloseRequest={() => this.setState({ openLightBox: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                imageIndexLightBox: (this.state.imageIndexLightBox + this.state.files.length - 1) % this.state.files.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                imageIndexLightBox: (this.state.imageIndexLightBox + 1) % this.state.files.length,
                            })
                        }
                    />
                )}

                </>
        );
    }
}
export default UploadFileBootStrap;