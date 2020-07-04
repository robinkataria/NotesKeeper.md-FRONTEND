import React,{useState} from 'react';
import TextField from '@material-ui/core/TextField';
import BrandName  from '../components/UtilComponents/Brand'
import Fade from '@material-ui/core/Fade'
import axios from 'axios'
import isEmail from '../utils/validations/isEmail'
import Tooltip from '@material-ui/core/Tooltip'
import ErrorIcon from '@material-ui/icons/Error'
import Alert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'
import SendIcon from '@material-ui/icons/Send';


const validateName = (name)=>{
    if(name.length < 3 || name.includes(' ')){
        return false
    }else{
        return true
    }
}

function Contact(){

    const [state,setstate] = useState({
        error:{
            name:{exist:false,msg:''},
            email:{exist:false,msg:''},
            server:{exist:false,msg:''}
        },
        success:{exist:false,msg:''},
        name:'',
        email:'',
        message:{val:'',rem:500,open:false},
        progress:false
    })

    const submitForm = (e)=>{
        e.preventDefault()
        if(!isEmail(state.email)){
            setstate({...state,error:{...state.error,email:{exist:true,msg:'Invalid Email address'}}})
        }else if(!validateName(state.name.split(' ')[0])){
            setstate({...state,error:{...state.error,name:{exist:true,msg:'Name must contain atleast 3 characters without space in starting.'}}})
        }else{
            setstate({...state,progress:true})
            const data = {
                form_client_id:'5efc6a98b3b91100048c09bf-5f002dfce546b90004d76a64-1593866208216-inquiry-scuttle-form',
                inquiry:{
                    name:{
                        firstname:state.name.split(' ')[0],
                        middlename:'',
                        lastname:''
                    },
                    email:state.email,
                    message:state.message.val
                }
            }
            axios.post('https://inquiry-scuttle.herokuapp.com/clientapi/create/inquiry?form_type=csa',data)
            .then(result =>{
                switch(result.data.status){
                    case 200:{
                        setstate({
                            progress:false,
                            error:{
                               name:{exist:false,msg:''},
                                email:{exist:false,msg:''},
                                server:{exist:false,msg:''} 
                            },
                            success:{exist:true,msg:'Successfully recieved your message. We will get back to you as soon as We can.'},
                            message:{val:'',rem:500,open:false},
                            name:'',
                            email:''
                        });
                        break;
                    }
                    case 423:setstate({...state,progress:false,error:{...state.error,server:{exist:true,msg:`data validation error type: ${result.data.type}`}}});break
                    case 422:setstate({...state,progress:false,error:{...state.error,server:{exist:true,msg:`Page Under Maintenance`}}});break;
                    case 500:setstate({...state,progress:false,error:{...state.error,server:{exist:true,msg:'something went wrong at scuttle end.'}}});break;
                    default:console.log('contact page default exec')
                }
            }).catch(err=>{
                setstate({...state,progress:false,error:{...state.error,server:{exist:true,msg:'something went wrong at scuttle end.'}}})
            })
        }
    }

    const clearError = (type) => {
        switch(type){
            case 'name':setstate({...state,error:{...state.error,name:{exist:false,msg:''}}});break;
            case 'email':setstate({...state,error:{...state.error,name:{exist:false,msg:''}}});break;
            case 'server':setstate({...state,error:{
                    name:{exist:false,msg:''},
                    email:{exist:false,msg:''},
                    server:{exist:false,msg:''}
            }});break;
            default : console.log('def exec')
        }
    }

    const handleMessageChange = (e)=>{
        const m = e.target.value
        if(m.length <= 500){
            if(m.length === 0 ){
                setstate({...state,message:{val:'',rem:500,open:false}})
            }else{
                setstate({...state,message:{val:m,rem:500-m.length,open:true}})
            }
        }
    }

return (
    <div className='d-flex justify-content-center align-items-center bg-dark p-2' style={{minHeight:'100vh'}}>
         <Fade in={true}>
        <div className = 'col-12 col-lg-4 col-md-6 col-xl-4 p-4 bg-white shadow-lg rounded'>
           <form onSubmit={submitForm}>
            <div>
                <BrandName color='dark'/>
            </div>
            <div className='h3 mt-4 mb-2'>Let Us Evaluate</div>
            <div className='text-muted mb-4'>Leave us a message with your Query</div>
            <div className='form-group my-4 d-flex align-items-center'>
                <TextField
                    required
                    id="name"
                    label="Name"
                    size='small'
                    placeholder='Enter Your Name'
                    variant="outlined"
                     fullWidth
                     value={state.name}
                     onChange={(e)=>setstate({...state,name:e.target.value})}
                     onFocus={()=>clearError('name')}
                    />
                {
                    (state.error.name.exist)?
                    <Tooltip title={state.error.name.msg} arrow>
                        <ErrorIcon className='text-warning'/>
                    </Tooltip>:<></>
                }
            </div>
            <div className='form-group my-4 d-flex align-items-center'>
                <TextField
                    required
                     fullWidth
                     size='small'
                    id="email"
                    label="Email"
                    placeholder='Enter Your Email'
                    variant="outlined"
                    value={state.email}
                     onChange={(e)=>setstate({...state,email:e.target.value})}
                     onFocus={()=>clearError('email')}
                    />
                {
                    (state.error.email.exist)?
                    <Tooltip title={state.error.email.msg} arrow>
                        <ErrorIcon className='text-warning'/>
                    </Tooltip>:<></>
                }
            </div>
            {
                (state.message.rem !== 500)?
                <p className='text-muted' style={{fontSize:'0.8rem'}}>Remaining Characters {state.message.rem}/500</p>
                :<></>
            }
             <div className='form-group  mb-4'>
                <TextField
                    fullWidth
                    required
                    size='small'
                    id="mail"
                    label="Tell Us About It"
                    placeholder='Write your query here'
                    value={state.message.val}
                    onChange={handleMessageChange}
                    variant="outlined"
                    rows='6'
                    multiline
                    />
            </div>
            <div className='form-group my-4 d-flex justify-content-end'>
                {
                    (state.progress)?
                    <CircularProgress size={20}/>:
                    <div className='d-flex align-items-center'>
                        {(state.error.server.exist)?
                        <Tooltip arrow title = {state.error.msg}>
                            <ErrorIcon className='text-warning' />
                        </Tooltip>
                        :<></>
                        }
                        <button 
                        type='submit' 
                        onFocus={()=>clearError('server')}
                        disabled={state.progress} 
                        className = 'btn btn-dark'>
                          <SendIcon className='text-white'/>  SEND
                        </button>
                    </div>
                }
            </div>
            {
                (state.success.exist)?
                <div className='form-group my-4'>
                    <Alert variant='outlined' type='success'>{state.success.msg}</Alert>
                </div>
                :<></>
            }
        </form>
        <p className='py-2 text-muted m-0 fsm mbl'>
            Powered by  
            <a href='https://inquiryscuttle.web.app' className='text-decoration-none text-dark ml-2'>
                <b>I</b>nquiry <b>S</b>cuttle
            </a>
        </p>
      </div>
     </Fade>
    </div>
)
}

export default Contact