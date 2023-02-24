import './Sign_up.css';

import React,{ useState,useEffect,useRef  } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';
import {AppContext} from "../../context/Context"
import { ChakraProvider } from '@chakra-ui/react'
import logo from '../../Assets/SocialPost-Logo.png';
import {CALLAPI} from '../../libs/APIAccessAndVerification'
import { ToastContainer, toast } from 'react-toastify';
import {APIStatus}  from '../../variables/variables';
import {APIStatuses}  from '../../variables/variables';
function App() {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  let UserExistStatus= useRef(false); //Flag indicated if the User exist or not
  let GroupExistStatus = useRef(false); //flag indicate if the default group name exist or not
  let EmailExistStatus = useRef(false); //flag indicated if the Email used or not
  let PhoneNumberExistStatus = useRef(false); //flag indicated if the PhoneNumber used or not

  const handlesubmit=(props)=>
{
  props.preventDefault()
  //turning on the spinner till the API call is finished
  setLoadingSpinnerStatus(true)
  UserExistStatus.current=false
  //Converting Form Data to a Json object
  let JsonObject
  let ConfirmPassword=""
  let Password=""
  let JsonString="{"
  for(let i=0;i<9;i++)
    {
      if(i==8)
      {
        ConfirmPassword=props.target[i].value
        JsonString+="}"
      }
     
      if(i==7)
      {
      JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\""
      Password=props.target[i].value
      }
      else 
         if(i!=8)
         {
          JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
         } 
      
    }
   
 JsonObject=JSON.parse(JSON.stringify(JsonString))
 //Sending a POST HTTP To the API with the Json Object
 let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_REGISTERAPINAME
 if(ConfirmPassword==Password)
 {
  
  if(Password.length>5)
 {
 
 let APIResult=CALLAPI(url,JsonObject)

 APIResult.then(result=>{
 if(APIStatus.Status==APIStatuses.APICallSuccess)
 { 
  for( var property in result)
      {
        
        if(property==="UsernameExist" && result[property]==="true")
        {  
            
          UserExistStatus.current=true
          toast.info('The Username you used exist, please pick an other Username', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
        else
        {
          UserExistStatus.current=false
        }

        if(property==="GroupNameExist" && result[property]==="true")
        {  
            
          GroupExistStatus.current=true
          

          toast.info('The Campaign Name you re trying to use already exist, please pick an other one!', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
        else
        {
          GroupExistStatus.current=false
        }

        if(property==="PhoneNumberUsed" && result[property]==="true")
        {  
            
          PhoneNumberExistStatus.current=true
          toast.info('The Phone Number you typed already used in an other account.', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
          
        }
        else
        {
          PhoneNumberExistStatus.current=false
        }

        if(property==="EmailUsed" && result[property]==="true")
        {  
            
          EmailExistStatus.current=true
          toast.info('The Email is already used in an other account!', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
        else
        {
          EmailExistStatus.current=false
        }
      }

       
    if(UserExistStatus.current==false && GroupExistStatus.current==false &&APIStatus.Status==APIStatuses.APICallSuccess && EmailExistStatus.current==false &&PhoneNumberExistStatus.current==false)
    { 
     
      toast.success('You registered successfully!', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        window.location.replace('/login')
    }
    }
      setLoadingSpinnerStatus(false) 
     
 }).catch(error=>{
  console.log(error)
 })
}
else
{ 
  setLoadingSpinnerStatus(false)
  toast.info('The Password should contain at least six character', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
}
 }
else
{
  setLoadingSpinnerStatus(false)
  toast.info('Your confirm password doesnt match your password', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
}



}


  return (
    <ChakraProvider>
    <MDBContainer fluid className=' background-radial-gradient overflow-hidden' style={{backgroundImage: `url("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp")`,backgroundRepeat:"no-repeat"}}>
      <MDBRow>

        <MDBCol md='5' className='text-center text-md-start d-flex flex-column justify-content-center'>

        <div className="container-sm">
        <img src={logo} className="img-fluid" alt="Sample image" />
        </div>

          

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
             <form onSubmit={handlesubmit}>     
              <MDBRow>
                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text' name="FirstName" required={true}/>
                </MDBCol>

                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='Last name' id='form2' type='text' name="LastName" required={true}/>
                </MDBCol>
              </MDBRow>
              <MDBInput wrapperClass='mb-4' label='Username' id='form3' type='text' name="UserName" required={true}/>
              <MDBInput wrapperClass='mb-4' label='Email' id='form4' type='email' name="Email" required={true}/>
              <MDBInput wrapperClass='mb-4' label='Age' id='form5' type='number'name="Age" required={true}/>
              <MDBInput wrapperClass='mb-4' label='Campaign Name' id='form6' name="CampaignName" type='text' required={true}/>
              <MDBInput wrapperClass='mb-4' label='Phone Number' id='form7' name="PhoneNumber" type='number' required={true}/>
              <MDBInput wrapperClass='mb-4' label='Password' id='form8' name="Password" type='password' required={true}/>
              <MDBInput wrapperClass='mb-4' label='Confirm Password' id='form9' name="CPassword" type='password' required={true}/>
              <div className='d-flex justify-content-center mb-4'>
                {/*<MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' />*/}
                <p className="small fw-bold mt-2 pt-1">You Already have an account?  <a href="/Login" className="link-danger">Sign In</a></p>
              </div>

              <MDBBtn className='w-100 mb-4' size='md' type='submit'>sign up</MDBBtn>
              <div className='d-flex justify-content-center '>
                {LoadingSpinnerStatus&&<LoadingSpinner id="Spinner"/>}             
              </div> 
               
              </form>
              
            
              <div className="text-center">

                <p>Or sign up with:</p>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn>

               

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                

              </div>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
    </ChakraProvider>
  );
}

export default App;