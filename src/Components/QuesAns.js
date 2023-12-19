import React from 'react';
import Answers from './Answers';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';

function QuesAns({ quesAns, indx }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsCorrect(selectedOption === quesAns.correctAnswer);
  };

  return (
    <>
      {/* <Card.Header>{quesAns.question.slice(1)}</Card.Header> */}
      <h4 className="questions_question">
        {indx + 1}. {quesAns.question.replace(/^\d+\.\s*/, '')}
      </h4>
      {/* the code below is a free response code */}
      {/* <Answers quesAns={quesAns} answers={quesAns.correctAnswer} /> */}

      <Form onSubmit={handleSubmit}>
        {quesAns.options.map((option, index) => (
          <Form.Check
            type="radio"
            id={`option${indx}${index}`}
            label={option.replace(/^[a-dA-D]\.\s*/, '')}
            name={`option${indx}`}
            key={index}
            onChange={() => setSelectedOption(option)}
          />
        ))}
        <Button variant="custom" type="submit">
          Check Answer
        </Button>
      </Form>

      {isCorrect !== null && (
        <Alert variant={isCorrect ? 'success' : 'danger'}>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </Alert>
      )}
    </>
  );
}

export default QuesAns;
