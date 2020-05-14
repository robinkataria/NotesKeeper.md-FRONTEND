import React,{useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faList,faPlus,faListAlt} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import CircularProgress from '../../UtilComponents/CircularProgress'
import Alert from '@material-ui/lab/Alert'
import {connect} from 'react-redux'
import {setNotebooksArray} from '../../../redux/notebooks/notebooks.actions'
import Fade from '@material-ui/core/Fade'
import {Link} from 'react-router-dom'
import history from '../../../history'

function Notebook(props){

    const [progress,setprogress] = useState(false)
    const [error,seterror] = useState(false)

    const deleteNotebook = ()=>{
        setprogress(false)
        axios.post('/notesapi/deletenotebook',{
            notebook_id:props.notebook_id
        },{WithCredentials:true})
        .then(result=>{
            setprogress(true)
            let status = result.data.status
            if(status === 500){
               seterror(true)
            }else if(status === 401){
                seterror(true)
            }else if(status === 200){
                props.setNotebooksArray(result.data.notebooks)
            }
        }).catch(err=>{
            setprogress(false)
            seterror(true)
        })  
    }

return (<Fade in={true}>
                        <div className='col-12 col-md-6 col-lg-3 p-2'>
                            <div className='border text-decoration-none text-dark border-dark p-2 rounded'>
                                {(error)?<div className='form-group'>
                                    <Alert severity='error' variant='filled'>
                                        <span className='fm'>
                                            Error occured while Deleting this Notebook
                                        </span>
                                    </Alert>
                                </div>:<></>
                                }
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Link to={'/readnotebook/'+props.notebook_id} className='h6 text-break text-dark'>
                                        {(props.name.length > 12)?props.name.substring(0,12)+'...':props.name}
                                    </Link>
                                    {(progress)?<CircularProgress/>:
                                    <IconButton onClick={deleteNotebook}>
                                        <DeleteIcon />
                                    </IconButton>
                                    }
                                </div>
                                <div className='form-group'>
                                    <label className='text-muted fm'>{props.createdAt}</label>
                                </div>
                                <p className='fm'>
                                    {(props.description.length > 100)?props.description.substring(0,100)+'...':props.description}
                                </p>
                            </div>
                        </div>
                        </Fade>
)
}

const mapDispatchToProps = dispatch=>({
setNotebooksArray : array=>dispatch(setNotebooksArray(array))
})

export default connect(null,mapDispatchToProps)(Notebook)