import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import ReactQuill, {Quill} from "react-quill";
import styled from "styled-components";
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{'header': [1, 2, 3, 4, false]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
    ],
    counter: {
        container: '#word-count',
        unit: 'chars'
    }
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

Quill.register('modules/counter', function (quill, options) {
    const container = document.querySelector(options.container);
    quill.on('text-change', function () {
        const text = quill.getText();
        if (options.unit === 'word') {
            container.innerText = text.split(/\s+/).length + ' words';
        } else {
            container.innerText = text.length + ' chars';
        }
    });
});

const Editor = props => {
    let quillRef = useRef(null);

    return (
        <>
            <QuillParent>
                <div style={{marginBottom: '8px'}}>
                    <label>{props.label}</label>
                </div>
                <ReactQuill theme="snow"
                            modules={modules}
                            ref={quillRef}
                            onChange={(e)=> props.onChange(e)}
                            defaultValue={props.defaultValue}
                            formats={formats}
                            placeholder={props.placeholder}
                            style={{borderRadius: '4px'}}
                />
                <span id="word-count"/>


            </QuillParent>
        </>
    );
};

const QuillParent = styled.div`
  span#word-count {
    display: flex;
    justify-content: end;
    margin: 8px;
    font-size: 12px;
  }
  
  label {
    font-weight: bold;
    color: #444444;
  }
`

export default Editor;
