import React, {Component} from 'react';
import {ContentState, EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg"
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import WysiwygCustomImageUploadIcon from "./WysiwygCustomImageUploadIcon";
import {Spinner} from "react-bootstrap";
import {Cancel, Check, Error} from "@mui/icons-material";
import PropTypes from "prop-types";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import docs from "../../img/icons/docs.png";
import {cleanFilename} from "../../Util/GlobalFunctions";

class WysiwygEditor extends Component{
    constructor(props){
        super(props);
        // this.clearImages = createRef();
        this.state = {
            editorState: EditorState.createEmpty(),

        };

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        }, () => {

            const content = this.state.editorState.getCurrentContent();
            // this.props.richTextHandleCallback(draftToHtml(convertToRaw(content)));
            this.props.richTextHandleCallback(content);
        });

    };

    resetDraft = () => {
        const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
        // this.clearImages.current.resetImagesAfterMessageSend(); // reset and clear images
        this.setState({ editorState });
    }

    handleKeyCommand = (command) => {
        console.log("> ", command)
    }

    myKeyBindingFn = (e) => {
        if (e.keyCode === 13) {
            this.props.handleEnterCallback(e.keyCode);
            return e.keyCode;
        }

        return;
    }

    handleUploadCallback = (values, files,artifacts) => {
        this.props.handleImageUploadCallback(values, files,artifacts)
    }



    static propTypes = {
        onChange: PropTypes.func,
        editorState: PropTypes.object,
    };


    handleChangeFile=(event) =>{
        let files = this.props.uploadedFiles;

        let newFiles = [];

        for (let i = 0; i < event.target.files.length; i++) {
            files.push({ file: event.target.files[i], status: 0, id: null });
            newFiles.push({ file: event.target.files[i], status: 0, id: null });
        }

        this.uploadImage(newFiles);
    }

    handleCancel(e) {
        e.preventDefault();

        let index = e.currentTarget.dataset.index;
        let name = e.currentTarget.dataset.name;
        let url = e.currentTarget.dataset.url;

        let files = this.props.uploadedFiles.filter((item) => item.file.name !== name);

         let   artifacts= this.props.uploadedArtifacts.filter((item) => item.name !== name)


        let images = [];
        for (let k = 0; k < files.length; k++) {
            if (files[k].id) {
                images.push(files[k].id);
            }
        }

        this.props.handleImageUploadCallback(images,files,artifacts); // callback for image ids
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    getImageAsBytes(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = () => {
                let arrayBuffer = reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    uploadImage=(files)=> {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let imgFile = files[i];

                this.getImageAsBytes(imgFile.file)
                    .then((data) => {
                        const payload = data;

                        try {
                            axios
                                .post(
                                    `${baseUrl}artifact/load?name=${cleanFilename(imgFile.file.name.toLowerCase())}`,
                                    payload
                                )
                                .then((res) => {
                                    let images = [...this.props.uploadedImages];
                                    images.push(res.data.data._key);

                                    let artifacts = this.props.uploadedArtifacts;

                                    artifacts.push(res.data.data);

                                    let currentFiles = this.props.uploadedFiles;

                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 1; //success
                                            currentFiles[k].id = res.data.data._key; //success
                                        }
                                    }

                                    this.handleUploadCallback(images, currentFiles,artifacts);

                                })
                                .catch((error) => {
                                    let currentFiles = [...this.props.uploadedFiles];
                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 2; //failed
                                        }
                                    }

                                    this.handleUploadCallback(this.props.uploadedImages,this.props.uploadedFiles,
                                        this.props.uploadedArtifacts)

                                });
                        } catch (e) {
                            console.log("catch Error ", e);
                        }
                    })
                    .catch((error) => {
                        console.log("image upload error ", error);
                    });
            }
        }
    }
    render(){
        const { editorState } = this.state;

        return <div className="position-relative">
            <div className="message-upload-images-container d-flex ps-1" >
                {this.props.uploadedFiles &&
                this.props.uploadedFiles.map((item, index) => (
                    <div key={index} className={"file-uploader-thumbnail-container"}>
                        <div
                            data-index={index}
                            className={"file-uploader-thumbnail"}
                            // style={{
                            //     backgroundImage: `url("${
                            //         item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)
                            //     }")`,
                            // }}
                            style={{
                                backgroundImage: `url("${item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)}"),url(${docs})`

                            }}

                        >
                            {item.status === 0 && (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{
                                        color: "#cccccc",
                                    }}
                                    className={"center-spinner"}
                                />
                            )}

                            {item.status === 1 && (
                                <Check
                                    style={{
                                        color: "#cccccc",
                                    }}
                                    className={" file-upload-img-thumbnail-check"}
                                />
                            )}
                            {item.status === 2 && (
                                <span className={"file-upload-img-thumbnail-error"}>
                                        <Error
                                            style={{
                                                color: "red",
                                            }}
                                        />
                                        <p>Error!</p>
                                    </span>
                            )}
                            <Cancel
                                data-name={
                                    item.file && item.file["name"] ? item.file["name"] : ""
                                }
                                data-index={item.id}
                                onClick={this.handleCancel.bind(this)}
                                className={"file-upload-img-thumbnail-cancel"}
                            />
                        </div>
                    </div>
                ))}
            </div>



            <Editor

                // placeholder="Enter message here..."
                // toolbarOnFocus
                // plugins={[]}
                toolbarClassName="wysiwyg-toolbar"
                wrapperClassName="wysiwyg-wrapper"
                editorClassName="wysiwyg-editor"
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize','list',
                        'textAlign',
                        // 'link',
                        'colorPicker','emoji',
                        // 'image'
                    ],

                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    // image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
                toolbarCustomButtons={[<WysiwygCustomImageUploadIcon  handleChangeFile={this.handleChangeFile} />]}
                // handleKeyCommand={(command) => this.handleKeyCommand(command)}
                // keyBindingFn={(e) => this.myKeyBindingFn(e)}
                // mention={{
                //     separator: ' ',
                //     trigger: '@',
                //     suggestions: [
                //         { text: 'APPLE', value: 'apple', url: 'apple' },
                //         { text: 'BANANA', value: 'banana', url: 'banana' },
                //         { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                //         { text: 'DURIAN', value: 'durian', url: 'durian' },
                //         { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
                //         { text: 'FIG', value: 'fig', url: 'fig' },
                //         { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
                //         { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
                //     ],
                // }}
            />


        </div>
    }
}

export default WysiwygEditor;
