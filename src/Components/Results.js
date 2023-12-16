import React from 'react';
import QuesAns from './QuesAns';
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

function Results({ data }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  let questions = [];
  let formattedQuestions = [];

  const cleanData = () => {
    questions = data.split(/\d(?=\.)+|\n|Q/).filter(Boolean);
    questions = questions.filter((elem) => elem !== ' ');

    formattedQuestions = questions.reduce((acc, curr, index) => {
      if (index % 2 === 0) {
        acc.push({ question: curr, answer: questions[index + 1] });
      }
      return acc;
    }, []);
  };

  cleanData();
  return (
    <>
      <h1 className="questions_title">Practice Questions</h1>
      <hr />
      <Carousel
        slide={false}
        variant="dark"
        activeIndex={index}
        onSelect={handleSelect}
      >
        {formattedQuestions.map((x, indx) => (
          // <Card style={{ width: '100%' }} key={indx}>
          <Carousel.Item
            key={indx}
            index={indx}
            // active={x.question === formattedQuestions[index].question}
          >
            <QuesAns quesAns={x} indx={indx} />
          </Carousel.Item>
          // </Card>
        ))}
      </Carousel>
    </>
  );
}

export default Results;
