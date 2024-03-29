import React,{useEffect,useState} from 'react';
import axios from 'axios'
import PreLoader from './components/UtilComponents/PreLoader'
import ServerError from './components/UtilComponents/ServerError'
import Page404 from './components/UtilComponents/Page404'
import LandingPage from './containers/LandingPage'
import Authenticate from './containers/Authenticate'
import VerifyEmail from './containers/VerifyEmail'
import ResetPassword from './containers/ResetPassword'
import Dashboard from './containers/Dashboard'
import Contact from './containers/Contact'
import {Route,Switch,Redirect} from 'react-router-dom'
import querystring from 'query-string'
import {setCurrentUser} from './redux/user/user.actions'
import {connect} from 'react-redux'
import 'jquery/src/jquery'
import 'popper.js/dist/popper'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './styles/main.css'
import 'prismjs/themes/prism-solarizedlight.css'

function App(props) {

   const [screen,resetScreen] = useState({loading:true,error:false})

   useEffect(() => {
     axios.get('/checklogin',{
       withCredentials:true
     })
     .then(res=>{
          if(res.data.logged_in){
              props.setCurrentUser(res.data)
              resetScreen({...screen,loading:false})
          }else{
            resetScreen({...screen,loading:false})
          }
     })
     .catch(err=>{
        resetScreen({loading:false,error:true})
     })
   },[])

  if (screen.loading) {
    return <PreLoader/>
  }else if (screen.error){
    return <ServerError/>
  } else {
    if (props.logged_in) {
      return (<Switch>
                <Route path='/' component={Dashboard} />
                <Route >
                  <Redirect to='/' />
                </Route>
              </Switch>)
    } else {
      return (<Switch>
                  <Route exact path='/' component={LandingPage} />
                  <Route exact path='/login' component={()=><Authenticate page='login' />} />
                  <Route exact path='/signup' component={()=><Authenticate page='signup' />}/>
                  <Route exact path='/forgotpassword' component={()=><Authenticate page='forgotpassword' />} />
                  <Route exact path='/resetpassword' component={(prop)=>{
                        const {token} = querystring.parse(prop.location.search)
                        return <Authenticate token = {token} page={'reset'} />
                      }}/>
                  <Route path='/verifyemail' component={(prop)=>{
                        const {token} = querystring.parse(prop.location.search)
                        return <VerifyEmail token = {token} />
                      }}/>
                  <Route exact path='/contact' component={Contact} />
                  <Route component={Page404}/>
              </Switch>)
    }
  }
}

const mapStateToProps = (state) => ({
  logged_in: state.user.logged_in,
})

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: userObject => dispatch(setCurrentUser(userObject)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
