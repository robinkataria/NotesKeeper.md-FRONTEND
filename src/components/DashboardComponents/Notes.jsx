import React,{useState,useEffect} from 'react';
import Navbar from '../DashboardComponents/Navbar'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBookmark,faPlus,faTrash,faCodeBranch} from '@fortawesome/free-solid-svg-icons'
import Divider from '@material-ui/core/Divider'
import {Link} from 'react-router-dom'
import Searchbar from './Searchbar'
import Alert from '@material-ui/lab/Alert'
import axios from 'axios'
import {connect} from 'react-redux'
import {setNotebook} from '../../redux/notebooks/notebooks.actions'
import Note from './notes/Note'
import LinearProgress from '../UtilComponents/LinearProgress'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '../UtilComponents/CircularProgress'

function Notes(props){

    const [state,setstate] = useState({loading:true,error:false,msg:''})

    const [search,setsearch] = useState(false)

    const [error,seterror] = useState({exist:false,msg:''})

    const [progress,setprogress] = useState(false)

    const [reset,setreset] = useState(true)

    const deleteAllNotes = ()=>{
        setprogress(true)
        axios.post('/notesapi/deleteAllNotes',{notebook_id:props.notebook_id},{withCredentials:true})
        .then(result=>{
            setprogress(false)
            let status = result.data.status
            if(status === 500){
                seterror({exist:true,msg:'server error'})
            }else if(status === 401){
                seterror({exist:true,msg:'Unauthorized'})
            }else if(status === 200){
                props.setNotebook(result.data.notebook)
            }
        }).catch(err=>{
            setprogress(false)
            seterror({exist:true,msg:'server error'})
        })
    }
    
    useEffect(()=>{
        axios.post('/notesapi/readnotebook',{
            notebook_id:props.notebook_id
        },{withCredentials:true})
        .then(result=>{
            let status = result.data.status
            if(status === 500){
                setstate({loading:false,error:true,msg:'server error'})
            }else if(status === 401){
                setstate({loading:false,error:true,msg:'Unauthorized'})
            }else if(status === 200){
                setstate({loading:false,error:false,msg:''})
                props.setNotebook(result.data.notebook)
            }
        }).catch(err=>{
            setstate({loading:false,error:true,msg:'server error'})
        })
    },[reset,])

    return (
        <Fade in={true}>
            <>
            <Navbar type='none'/>
            <Divider/>
            <div className='d-flex justify-content-center'>
                <div className='col-12 col-md-10 col-lg-8 my-2'>
                    <div className='form-group my-3'>
                        <div className='d-flex justify-content-between align-items-center mb-2'>
                            <Link to={'/readnotebook/'+props.notebook_id} className='text-decoration-none text-dark' onClick={()=>setreset(!reset)}>
                               <FontAwesomeIcon icon={faBookmark}/> {props.notebook.name}
                            </Link>
                            {(progress)?
                            <CircularProgress />:
                            <button className='btn btn-dark rounded fm ' onClick={deleteAllNotes} >
                               <FontAwesomeIcon icon={faTrash} /> Delete All Notes
                            </button>
                            }
                        </div>
                        <p>{(error.exist)?<Alert severity='error' variant='filled' >{error.msg}</Alert>:<></>}</p>
                        <p className='form-control bg-light text-dark'><small>{props.notebook.description}</small></p>
                    </div>
                        
                    <Divider/>
                    <div className='d-flex justify-content-between align-items-center my-2'>
                        <Link to={'/readnotebook/'+props.notebook_id} className='h5 my-auto text-decoration-none text-dark' onClick={()=>setreset(!reset)}>
                            <FontAwesomeIcon icon={faCodeBranch}/> Notes
                        </Link>
                        <Link className='btn btn-dark' to={'/newnote/'+props.notebook_id}>
                            <FontAwesomeIcon icon={faPlus}/> New Note
                        </Link>
                    </div>
                    <Divider />
                        <Searchbar type='notes' setsearch={setsearch} notebook_id={props.notebook_id} />
                    <Divider/>
                    <div className='d-flex flex-wrap' style={{minHeight:'55vh'}}>
                        {(state.loading)?<LinearProgress/>:<>
                            {(state.error)?<Alert severity='error' className='col-12 my-2' variant='filled'>{state.msg}</Alert>:
                            <>
                                {
                                    (props.notebook.notes.length === 0)?
                                    <>
                                        {
                                            (search)?
                                                  <div className='col-12 p-0 my-2'><Alert severity='info' variant='filled'>No Result Found</Alert></div>:
                                                  <div className='col-12 p-0 my-2'><Alert severity='info'  variant='filled'>Create Your First Note</Alert></div>
                                        }
                                    </>:
                                    <>
                                        {
                                            props.notebook.notes.map(note=>{
                                                return <Note name={note.name} commit_message={note.commit_message}
                                                key={note._id} createdAt={note.createdAt} 
                                                note_id={note._id} notebook_id={props.notebook_id} />
                                            })
                                        }
                                    </>
                                }
                            </>
                            }
                        </>}
                    </div>
                </div>
                
            </div>
        </>
        </Fade>
    )
}

const mapStateToProps = state=>({
    notebook:state.notebooks.notebook
})

const mapDispatchToProps = dispatch => ({
    setNotebook:notebook=>dispatch(setNotebook(notebook))
})

export default connect(mapStateToProps,mapDispatchToProps)(Notes)