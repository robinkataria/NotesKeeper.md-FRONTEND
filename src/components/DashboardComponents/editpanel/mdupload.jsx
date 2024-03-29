import React, { useState } from "react";
import '../../../styles/main.css'
import Alert from '@material-ui/lab/Alert'
import Dropzone from "react-dropzone";

export default function App(props) {
  const [state, setstate] = useState({error:false,filename:'',exist:false,msg:''});
  const handleDrop = acceptedFiles =>{
    if(acceptedFiles.length === 1){
      if(acceptedFiles[0].name.split('.').pop() === 'md'){
        setstate({...state,filename:acceptedFiles[0].name,exist:true})
        props.setFile(acceptedFiles[0] || null);
      }else{
        setstate({...state,error:true,msg:'Only Markdown Files are acceptable, if you have textual data then save it to .md file'})
      }
    }else{
      setstate({...state,error:true,msg:'select a file which is markdown and size less than 50kb'})
    }
  }

  return (
    <div className="App">
      <Dropzone onDrop={handleDrop} 
        maxSize={50000}
        multiple={false}>
        {({ 
          getRootProps, 
          getInputProps, 
          isDragActive,
          isDragAccept,
          isDragReject
         }) => {
          
           return (
                    <div {...getRootProps({ className: ` ${(isDragAccept)?'accept':''} ${(isDragReject)?'reject':''} ${(isDragActive)?'active':''} ${(isDragActive || isDragReject || isDragAccept)?'':'dropzone'}` })}>
                      <input {...getInputProps()} />
                      <p>Drag'n'drop or click to select  your text or markdown file</p>
                    </div>
                  )
        }
        }
      </Dropzone>
      <div>
          {
          (state.error)?
            <Alert severity='error' variant='filled' className='my-1' >{state.msg}</Alert>:
            <>
              {
                (state.exist)?
                <Alert severity='success' variant='filled' className='my-1' key={state.filename}>{state.filename}</Alert>:
                <></>
              }
           </>
          }
      </div>
    </div>
  );
}
