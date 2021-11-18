import React, {Component} from 'react';
import {ContentState, EditorState, convertToRaw} from "draft-js";
import {Editor} from "react-draft-wysiwyg"
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {convertToHTML} from "draft-convert";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';




function uploadImageCallBack(file) {
    return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        }
    );
}


class WysiwygEditor extends Component{
    constructor(props){
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
        };
    }

    onEditorStateChange = (editorState) => {
        // console.log(editorState)
        this.setState({
            editorState,
        });
        this.props.richTextHandleCallback(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
    };

    resetDraft = () => {
        console.log('reset ');
        const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
        this.setState({ editorState });
    }

    render(){
        const { editorState } = this.state;
        return <div className='editor'>
            <Editor
                // toolbarOnFocus
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
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