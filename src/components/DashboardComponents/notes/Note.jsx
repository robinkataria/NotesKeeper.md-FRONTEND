import React,{useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import axios from 'axios'
import CircularProgress from '../../UtilComponents/CircularProgress'
import Alert from '@material-ui/lab/Alert'
import {connect} from 'react-redux'
import {setNotebook} from '../../../redux/notebooks/notebooks.actions'
import Fade from '@material-ui/core/Fade'
import {Link} from 'react-router-dom'

function Note(props){


    const [progress,setprogress] = useState(false)
    const [error,seterror] =useState(false)
    const date = new Date(props.createdAt)

    const deleteNote = ()=>{
        setprogress(false)
        axios.post('/notesapi/deletenote',{
            notebook_id:props.notebook_id,
            note_id:props.note_id
        },{WithCredentials:true})
        .then(result=>{
            setprogress(true)
            let status = result.data.status
            if(status === 500){
               seterror(true)
            }else if(status === 401){
                seterror(true)
            }else if(status === 200){
                props.setNotebook(result.data.notebook)
            }
        }).catch(err=>{
            setprogress(false)
            seterror(true)
        })  
    }

return (<Fade in={true}><>
                            <div className='text-white bg-notebook shadow p-2 rounded m-0'>
                                {(error)?<div className='form-group'>
                                    <Alert severity='error' variant='filled'>
                                        <span className='fm'>
                                            Error occured while Deleting this Note
                                        </span>
                                    </Alert>
                                </div>:<></>
                                }
                                <div className='d-flex justify-content-between align-items-center my-2'>
                                    <Link to={'/readnote/'+(props.notebook_id || '')+'/'+(props.note_id || '')}
                                     className='text-decoration-none m-0 fl text-white text-break'>
                                        {(props.name.length > 12)?props.name.substring(0,12)+'...':props.name}
                                    </Link>
                                    {(progress)?<CircularProgress/>:
                                    <IconButton onClick={deleteNote} size='small' color='inherit'>
                                        <DeleteIcon fontSize='small' />
                                    </IconButton>
                                    }
                                </div>
                                <p className='fm my-2 text-white-50'>
                                    {(props.commit_message.length > 100)?props.commit_message.substring(0,100)+'...':props.commit_message}
                                </p>
                                <div className='form-group my-2'>
                                    <span className='fm m-0'>
                                        {date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()+' '+date.getHours()+':'+((date.getMinutes() <= 9)?'0'+date.getMinutes():date.getMinutes())}
                                    </span>
                                </div>
                            </div>
                        </>
                        </Fade>
)
}

const mapDispatchToProps = dispatch=>({
setNotebook : array=>dispatch(setNotebook(array))
})

export default connect(null,mapDispatchToProps)(Note)