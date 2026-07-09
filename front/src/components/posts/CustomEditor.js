'use client' // only in App Router

import { ClassicEditor } from 'ckeditor5'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {  
    Autoformat,
    Autosave,
    Bold, 
    BlockQuote,
    CodeBlock,
    CKFinder,
    CKFinderUploadAdapter,
    Essentials,
    FontSize,
    FontColor,
    Heading,
    Highlight,
    Italic, 
    Indent,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    ImageResize,
    ImageResizeEditing,
    ImageResizeHandles,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    Strikethrough,
    Subscript,
    Superscript,
    SourceEditing,
    Table,
    TableToolbar,
    TextTransformation,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

//const licenseKey = "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDE1NjQ3OTksImp0aSI6ImI3ZjgyMGM5LTY1MjQtNDA3ZC1iYjBjLTlhMGY0NWI1OTk4ZSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImFkODgxYTMzIn0.FgV4uyoMw7vFr300GXCBXBvf05hmYhjVNYx1J8PQ8J-N_0zJRrbuvucmkoc6mAwLt93yQIXLheB2lbwm7QKcWQ"
export const editorConfiguration = {
    licenseKey: 'GPL', // Or 'GPL'.
   // extraPlugins: [ CKFinder ],
    plugins: [
        Essentials,
        Autoformat,
        Bold,
        Italic,
        Strikethrough,
        Superscript,
        Subscript,
        BlockQuote,
        Heading,
        Link,
        List,
        Paragraph,
        CodeBlock,
        CKFinder,
        CKFinderUploadAdapter,
        FontColor,
        FontSize,
        ImageUpload,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        PictureEditing,
        ImageResize,
        ImageResizeEditing,
        ImageResizeHandles,
        Table,
        TableToolbar,
        TextTransformation,
        Indent,
        MediaEmbed,
        Autosave,
        Highlight,
        SourceEditing
     ],
    toolbar: [
        'heading',
        {
         label: 'Styles',
         icon:'text',
         items: [ 'bold','italic','strikethrough', 'superscript', 'subscript' ]
        },
        '|',
        'link',
         'codeBlock',

       'uploadImage',
       'ckfinder',
        
        {
         label: 'Lists',
         withText: true,
         items: [ 'bulletedList','numberedList',]
        },

        {
         label: 'More',
         icon:'plus',
         items: ['blockQuote','insertTable','mediaEmbed','sourceEditing']
        },
        {
         label: 'Indent',
         withText: true,
         items: [ 'outdent','indent']
        },
        {
         label: 'MoreStyles',
         icon: 'text',
         items: [ 'fontColor','fontSize', 'highlight',]
        },
        {
         label: 'func',
         items: [ 'undo','redo']
        },


     ],
    heading: {
        options: [
            { model: 'paragraph', title: 'p', class: 'ck-heading_paragraph' },
            { model: 'heading2', view: 'h2', title: 'H2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'H3', class: 'ck-heading_heading3' },
        ]
    },
    
     image: {
        toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            'resizeImage',

        ],
        resizeOptions: [
        {
            name: 'resizeImage:original',
            value: null,
            label: 'Original'
        },
        {
            name: 'resizeImage:25',
            value: '25',
            label: '25%'
        },
        {
            name: 'resizeImage:50',
            value: '50',
            label: '50%'
        },
        {
            name: 'resizeImage:75',
            value: '75',
            label: '75%'
        },
        {
            name: 'resizeImage:100',
            value: '100',
            label: '100%'
        }
    ],
    },
    
    link:{
        addTargetToExternalLinks: true,
    },
    mediaEmbed: {
        previewsInData: true
    },
    
    ckfinder: {
        uploadUrl:`${process.env.NEXT_PUBLIC_BACKEND_URL}/ckfinder/connector?command=QuickUpload&type=Images&responseType=json`,
        options: {
            resourceType: 'Images'
        },
    }, 
    codeBlock: {
        languages: [
            { language: 'plaintext', label: 'Plain text', class: '' },
            { language: 'HTML', label: 'HTML' },
            { language: 'CSS', label: 'CSS' },
            { language: 'SCSS', label: 'SCSS' },
            { language: 'JAVASCRIPT', label: 'JavaScript' },
            { language: 'PHP', label: 'PHP' },
            { language: 'Python', label: 'python' },
            { language: 'SQL', label: 'SQL' },
            { language: 'zsh', label: 'zsh' },
            
        ]
    }

  
}

export const editorConfigurationThumbnail = {
    licenseKey: 'GPL',
    plugins: [
        ImageUpload,
        Image,
        CKFinder,
        CKFinderUploadAdapter,
        Link     ],
    toolbar: [
        'uploadImage',
        'ckfinder',
     ],

     ckfinder:{
        uploadUrl:`${process.env.NEXT_PUBLIC_BACKEND_URL}/ckfinder/connector?command=QuickUpload&type=Images&responseType=json`,
    },

    
}


export default function CustomEditor ({form,setForm,thumbnail}){
    const setEfitorData = (e,editor,key)=>{
        setForm({...form,[key]:editor.getData()})
    }
    return(
        <>
        <CKEditor
            editor={ClassicEditor}
            config={thumbnail?editorConfigurationThumbnail:editorConfiguration}
            id={thumbnail? "thumbnail" : "content"}
            data={thumbnail?form.thumbnail:form.content}
            onChange={ ( e, editor,key=thumbnail?"thumbnail":"content" ) => {
                setEfitorData(e , editor, key)
            } }
            onBlur={ ( e, editor,key=thumbnail?"thumbnail":"content" ) => {
                setEfitorData(e , editor, key)
            }}
                
        />
        </>
    )
}
