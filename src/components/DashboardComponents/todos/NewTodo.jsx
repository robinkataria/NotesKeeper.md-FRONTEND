import React,{useState,useRef} from 'react'
import Fade from '@material-ui/core/Fade'
import axios from 'axios'
import LinearProgress from '../../UtilComponents/LinearProgress'
import Alert from '@material-ui/lab/Alert'
import {setTodosArray} from '../../../redux/todos/todos.action'
import validations from '../../../utils/validations/index'
import {connect} from 'react-redux'

function NewTodo(props){

    const todoName = useRef('')

    const [progress,setprogress] = useState(false)

    const [err,setErr] = useState({exist:0,msg:''})

    const [success,setsuccess] = useState(false)

    const validate = ()=>{
        if(!validations.validateName(todoName.current.value)){
            setErr({exist:1,msg:`Only Alphanumeric Characters are allowed`})
        }else{
            setErr({exist:0,msg:''})
        }
    }

    const submitForm =(e)=>{
        e.preventDefault()
        setprogress(true)
            axios.post('/todosapi/createtodo',{
                    name:todoName.current.value,
            },{withCredentials:true})
            .then(result=>{
                setprogress(false)
                console.log(result.data)
                let status = result.data.status
                if(status === 200){
                    props.setTodosArray(result.data.todos)
                    setsuccess(true)
                }else if(status === 500){
                    setErr({exist:1,msg:'server error'})
                }else if(status === 422){
                    setErr({exist:1,msg:'NoteBook with this Name Aleready Exist'})
                }else if(status === 423){
                    setErr({exist:1,msg:'Insufficient data sent'})
                }else if(status === 401){
                    setErr({exist:1,msg:'Unauthorized'})
                }
            }).catch(err=>{
                setprogress(false)
                setErr({exist:1,msg:'server error'})
            })
    }


return(
    <Fade in={true}>
        <div className='col-12 sheild-panel d-flex justify-content-center align-items-center'>
            <div className='col-12 col-md-6 col-lg-6 bg-white rounded py-2' >
               <form onSubmit={submitForm} className = 'd-flex justify-content-between flex-column ' style={{height:'60vh'}}>
                   <div>
                        <div className='form-group my-2'>
                            {(progress)?<LinearProgress/>:<></>}
                        </div>
                        <label className='h5 my-2'>Enter a Name for Your Todo List</label>
                        <p className='my-1 fm text-muted'>Name needs to be different from other Todo Lists</p>
                        <div className='form-group my-2'>
                            <input className='form-control' id='tdname' onChange={validate} ref={todoName} required />
                        </div>
                        <div className='form-group my-2'>
                            {(err.exist === 1)?<Alert severity='error'>{err.msg}</Alert>:<></>}
                        </div>
                         <div className='form-group my-2'>
                            {(success && err.exist === 0)?<Alert severity='success' variant='filled'>Todo List SuccessFully Created</Alert>:<></>}
                        </div>
                    </div>
                    <div className='d-flex justify-content-end my-2'>
                        <button className='btn btn-outline-danger mr-2' disabled={progress} onClick={()=>props.setopen(false)}>Cancel</button>
                        <button className='btn btn-outline-success' disabled={progress || err.exist === 1} type='submit'>Create</button>
                    </div>
                </form>
            </div>
        </div>
    </Fade>
)

}

const mapDispatchToProps = dispatch =>({
    setTodosArray:array=>dispatch(setTodosArray(array))
})

export default connect(null,mapDispatchToProps)(NewTodo)