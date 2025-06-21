import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), { ssr: false });

export default function Quill() {
  const [quillRef, setQuillRef] = useState(null);

  const toolbarContainer = [
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ font: [] }],
    [{ header: 1 }, { header: 2 }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['image', 'video', 'link'],
    ['clean'],
  ];

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      console.log('User trying to upload this:', file);
  
      const id = await uploadFile(file); // I'm using react, so whatever upload function
      const range = quillRef.getEditor().getSelection();
      const link = `${ROOT_URL}/file/${id}`;
  
      // this part the image is inserted
      // by 'image' option below, you just have to put src(link) of img here. 
      quillRef.getEditor().insertEmbed(range.index, 'image', link); 
    };
  };

  return (
    <div>
      <QuillNoSSRWrapper
        ref={setQuillRef}
        placeholder="請填寫活動詳情"
        theme="snow"
        modules={{
          toolbar: {
            container: toolbarContainer,
            handlers: {
              image: imageHandler
            },
          }
        }}
      />
    </div>
  );
}
