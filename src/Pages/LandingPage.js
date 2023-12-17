import React, { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import GenerateError from '../Components/GenerateError';

function LandingPage() {
  const generateError = (err) => {
    console.log(err);
    if (err.response.data.error) {
      toast.error(err.response.data.error, {
        position: 'bottom-right',
      });
    } else {
      toast.error('User already registered!', {
        position: 'bottom-right',
      });
    }
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     const token = localStorage.getItem('jwt');
  //     const response = await axios
  //       .post('http://localhost:5000', { jwt: token })
  //       .then((result) => {
  //         console.log('logged in');
  //       })
  //       .catch((err) => {
  //         generateError(err);
  //         // <GenerateError err={err} />;
  //       });
  //   }
  //   fetchData();
  // });

  let navigate = useNavigate();

  const routeChange = () => {
    navigate('/Home');
  };

  return (
    <div className="landing-page">
      <div className="landing-page-left-box">
        <h1>
          Welcome to <span className="landing-page-title">Beeline</span>
        </h1>
        <p className="landing-page-para">
          Beeline helps you prepare for the tests in the PGA program. The
          questions and answers come straight from the textbook given from
          canvas.
        </p>
        <Button variant="custom" onClick={routeChange}>
          Let's Get Started
        </Button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default LandingPage;
