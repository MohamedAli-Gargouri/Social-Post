import './Sign_in.css';
import React, { useState, useRef } from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from 'mdb-react-ui-kit';
import LoadingSpinner from '../../components/UI/SpinnerComps/LoadingSpinner';

import { PasswordRecovery } from './PasswordRecovery';
import logo from '../../assets/sp_logo_large.png';
import { toast } from 'react-toastify';
import { CALLAPI } from '../../libs/APIAccessAndVerification';
function App() {
  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  let [PasswordRecoveryStatus, setPasswordRecoveryStatus] = useState(false);
  let UserNameDontExist = useRef(false);
  let UserWrongPassStatus = useRef(false);
  let UserAuthentificated = useRef(false);

  let RememberMe = useRef(false);
  //This methode update the parent that the pop up closed
  const HandleRecoveryClosure = () => {
    setPasswordRecoveryStatus(false);
  };

  if (window.localStorage.getItem('IsRemembered') != null) {
    if (window.localStorage.getItem('IsRemembered').match(true)) {
      window.location.replace('/index');
    }
  }

  const handlesubmit = (props) => {
    props.preventDefault();
    setLoadingSpinnerStatus(true);
    UserAuthentificated.current = false;
    UserNameDontExist.current = false;
    UserWrongPassStatus.current = false;
    //Converting Form Data to a Json object
    let JsonObject;
    let JsonString = '{';
    for (let i = 0; i < 3; i++) {
      if (i === 2) RememberMe.current = props.target[i].checked;
      if (i != 1)
        JsonString +=
          '"' +
          props.target[i].name +
          '": ' +
          '"' +
          props.target[i].value +
          '",';
      else
        JsonString +=
          '"' +
          props.target[i].name +
          '": ' +
          '"' +
          props.target[i].value +
          '"}';
    }

    JsonObject = JSON.parse(JSON.stringify(JsonString));
    //Sending a POST HTTP To the API with the Json Object
    let url =
      process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_LOGINAPINAME;

    let APIResult = CALLAPI(url, JsonObject);

    APIResult.then((result) => {
      for (var property in result) {
        if (property === 'JWT_AccessToken') {
          UserAuthentificated.current = true;

          toast.success('You logged in successfully!"', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });

          if (RememberMe.current === true) {
            window.localStorage.setItem('AuthToken', result[property]);
            window.localStorage.setItem('IsRemembered', true);
          } else {
            window.localStorage.setItem('AuthToken', result[property]);
            window.localStorage.setItem('IsRemembered', false);
          }
          setLoadingSpinnerStatus(false);
        } else if (property === 'UserNotFound') {
          UserNameDontExist.current = true;

          toast.info(
            'The username you inserted doesnt exist or the account is disabled.',
            {
              position: 'bottom-left',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
          setLoadingSpinnerStatus(false);
        } else if (property === 'WrongPassword') {
          UserWrongPassStatus.current = true;

          toast.info(
            'You typed the wrong password, Check if you have CAPS on.',
            {
              position: 'bottom-left',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
          setLoadingSpinnerStatus(false);
        }
      }
      if (UserAuthentificated.current === true)
        window.location.replace('/index');
    }).catch(() => {
      toast.error(
        'Contact Dev team, there is an internal error within the server',
        {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      setLoadingSpinnerStatus(false);
    });
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col="10" md="6">
          <div className="container-sm">
            <img src={logo} className="img-fluid" alt="Sample image" />
          </div>

          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample image"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <form onSubmit={handlesubmit}>
            <MDBInput
              wrapperClass="m-4"
              label="Username"
              name="userName"
              id="formControl1"
              type="text"
              size="lg"
            />
            <MDBInput
              wrapperClass="m-4"
              label="Password"
              name="password"
              id="formControl2"
              type="password"
              size="lg"
            />

            <div className="d-flex justify-content-between mb-4">
              <MDBCheckbox
                name="RememberMe"
                value="on"
                type="checkbox"
                id="flexCheckDefault"
                label="Remember me"
              />
              <a
                href=""
                onClick={(props) => {
                  setPasswordRecoveryStatus(true);
                  props.preventDefault();
                }}
              >
                Forgot password?
              </a>
            </div>
            {PasswordRecoveryStatus && (
              <PasswordRecovery
                passedhandleclose={HandleRecoveryClosure}
                Open={PasswordRecoveryStatus}
              />
            )}
            <div className="text-center text-md-start mt-4 pt-2">
              <MDBBtn className="mb-0 px-5" size="lg">
                Login
              </MDBBtn>
              <div className="d-flex justify-content-center mb-4">
                {LoadingSpinnerStatus && <LoadingSpinner id="Spinner" />}
              </div>
              <div className="d-flex justify-content-center mb-4"></div>
              <p className="small fw-bold mt-2 pt-1 mb-2">
                Dont have an account?{' '}
                <a href="/Register" style={{ color: '#3b71ca' }}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
