import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Button, Modal, Spinner } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';

function InputFiles({ sendData, setInput }) {
  const pdfRef = useRef(null);

  const [formData, setFormData] = useState(new FormData());
  const [text, setText] = useState('');

  const [load, setLoad] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);

  const onFileChange = (e) => {
    if (e.target && e.target.files[0]) {
      formData.append('files', e.target.files[0]);
      formData.append('userInput', sliderValue);
      console.log(...formData);
    }
  };
  // https://pgastudyguide.me/pga-study-helper-server/

  const submitFilesData = () => {
    console.log(process.env.NODE_ENV);
    setLoad(true);
    const serverURL =
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_DEV_URL
        : process.env.REACT_APP_PROD_URL;
    axios
      .post(serverURL + '/addFile', formData) // this was formData
      .then((res) => {
        setLoad(false);
        console.log(res);
        setFormData(new FormData());
        // setText(res.data);
        // sendData(res.data);
        // console.log('from InputFiles.js', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const query = () => {
    setInput(true);
    setLoad(true);

    axios
      .post('http://localhost:5000/query', { numQuestions: sliderValue })
      .then((res) => {
        setLoad(false);
        if (res.data !== 'no file uploaded') {
          console.log(res);
          setText(res.data);
          sendData(res.data);
        } else {
          setText('no file uploaded');
          sendData('no file uploaded');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div className="input-files-container">
      <Form encType="multipart/form-data">
        <Form.Group className="mb-3" controlId="lecturePdf">
          <Form.Label>PGA Slides input here (PDF)</Form.Label>
          <Form.Control
            type="file"
            placeholder="Enter lecture slides in pdf form"
            ref={pdfRef}
            accept=".pdf"
            onChange={onFileChange}
          />
        </Form.Group>
        <Button variant="custom" type="button" onClick={submitFilesData}>
          Upload File
        </Button>
        <Form.Group controlId="numericValue">
          <Form.Label>How many practice questions would you like?</Form.Label>
          <RangeSlider
            min={1}
            max={20}
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <Form.Text id="numericValueHelpBlock" muted>
            {sliderValue}
          </Form.Text>
        </Form.Group>
        <Button variant="custom" type="button" onClick={query}>
          Generate Practice Questions
        </Button>
      </Form>
      {load ? (
        // <Spinner animation="border" variant="success" />
        <Modal centered show={load} onHide={() => setLoad(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Please be patient...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Spinner animation="border" variant="danger" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setLoad(false)}>
              I have no patience
            </Button>
          </Modal.Footer>
        </Modal>
      ) : //
      null}
    </div>
  );
}

export default InputFiles;
