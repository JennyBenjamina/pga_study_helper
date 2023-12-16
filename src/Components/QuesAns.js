import React from 'react';
import Answers from './Answers';
import Card from 'react-bootstrap/Card';

function QuesAns({ quesAns, indx }) {
  return (
    <>
      {/* <Card.Header>{quesAns.question.slice(1)}</Card.Header> */}
      <h4 className="questions_question">
        {indx + 1}. {quesAns.question.slice(1)}
      </h4>
      <Answers answers={quesAns.answer} />
    </>
  );
}

export default QuesAns;
