import React, { useEffect } from 'react';
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
  const [quesAns, setQues] = useState([]);

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

  useEffect(() => {
    const lines = data.split('\n');
    let question = '';
    let options = [];
    let correctAnswer = '';

    const questions = [];

    lines.forEach((line) => {
      if (line.startsWith('Question:')) {
        // If a new question starts and there's a previous question, push it to the array
        if (question) {
          questions.push({
            question,
            options,
            correctAnswer,
          });

          // Reset variables for the new question
          question = '';
          options = [];
          correctAnswer = '';
        }

        question = line.replace('Question: ', '');
      } else if (line.startsWith('Option:')) {
        options.push(line.replace('Option: ', ''));
      } else if (line.startsWith('CorrectAnswer:')) {
        correctAnswer = line.replace('CorrectAnswer: ', '');
      }
    });

    // Push the last question to the array
    if (question) {
      questions.push({
        question,
        options,
        correctAnswer,
      });
    }

    setQues(questions);
    console.log(questions);
  }, [data]);

  return (
    <>
      <h1 className="questions_title">Practice Questions</h1>
      <hr />
      <Carousel
        slide={false}
        variant="dark"
        activeIndex={index}
        onSelect={handleSelect}
        interval={null}
      >
        {/* {formattedQuestions.map((x, indx) => (
          // <Card style={{ width: '100%' }} key={indx}>
          <Carousel.Item
            key={indx}
            index={indx}
            // active={x.question === formattedQuestions[index].question}
          >
            <QuesAns quesAns={x} indx={indx} />
          </Carousel.Item>
          // </Card>
        ))} */}

        {/* <Carousel.Item>
          <QuesAns quesAns={quesAns} />
        </Carousel.Item> */}

        {quesAns.map((item, index) => (
          <Carousel.Item key={index}>
            <QuesAns quesAns={item} indx={index} />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default Results;
