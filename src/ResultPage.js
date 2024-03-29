// ResultPage.js
import React from 'react';

function ResultPage({ setCurrentPage, results }) {
  const handleGoBack = () => {
    setCurrentPage('duplicatesdetectionpage1');
  };

  return (
    <div className="ResultPage">
      <h1>Duplicate Detection Results</h1>
      <button onClick={handleGoBack}>Go Back</button>
      <ul>
        {results.map((item, index) => (
          <li key={index}>
            <p>Sentence: {item.Sentence}</p>
            <p>Duplicate: {item.Duplicate}</p>
            {item.Duplicate === 'Yes' && <p>Matched Index: {item.Matched_Index}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultPage;
