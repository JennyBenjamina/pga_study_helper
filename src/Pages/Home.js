import React, { useEffect } from 'react';
import InputFiles from '../Components/InputFiles';
import Filler from '../Components/Filler';
import Results from '../Components/Results';
import { useState } from 'react';

// work onthis later
function Home() {
  const [input, setInput] = useState(true);

  // const [data, setData] = useState('test'); // this is a test
  const [data, setData] = useState('test'); // this is a test

  const handleChange = (e) => {
    const { name, value } = e.target;
  };

  const searchInput = (e) => {
    const { name, value } = e.target;
  };

  const handleClick = () => {
    setInput(false);
  };

  useEffect(() => {
    if (data !== 'test') {
      // console.log(data);
      // setInput(!input);
      setInput(false);
    }
  }, [data]);

  return (
    <div className="Home">
      <div className="Home-left-box">
        <div className="Home-left-top">
          <h2 className="Home-heading">Let’s buzz through your materials</h2>
          <p className="Home-paragraph">
            Beeline takes the lecture files from canvas and generates a number
            of questions that can help supplement your studying.{' '}
            <span className="Home-notice">
              Note that the more relevant resources you upload, the more
              accurate and relevant your Beeline will be.
            </span>
          </p>
        </div>

        <div className="Home-practice-questions">
          <h2 className="Home-practice-heading">Practice Questions</h2>
          <p className="Home-practicing-paragraph">
            These questions are TRUE/FALSE and multiple choice questions that
            are generated from your uploaded files.{' '}
          </p>
          <InputFiles sendData={(d) => setData(d)} setInput={setInput} />
        </div>
      </div>

      <div className="Home-right-box">
        {input || data === 'no file uploaded' ? (
          <Filler message={'Upload a file!'} data={data} />
        ) : (
          <Results data={data} />
        )}
      </div>
    </div>
  );
}

export default Home;
