// import React from 'react';
// import ReactDOM from 'react-dom';
// import Header from './Homepage';
// import ClassifyDefectsPage1 from './classify_defects_page1'; // Import your component

// ReactDOM.render(
//   <React.StrictMode>
//     <div>
//       <Header /> {/* Render your Homepage component */}
//       <ClassifyDefectsPage1/> {/* Render your classify_defects_page1 component */}
//     </div>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './Homepage';
import ClassifyDefectsPage1 from './classify_defects_page1';
import DuplicatesDetectionPage1 from './duplicate_detection_page1';

function App() {
  // Define a state to track the current page
  const [currentPage, setCurrentPage] = useState('homepage');

  // Function to render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'homepage':
        return <Header setCurrentPage={setCurrentPage} />;
      case 'classify':
        return <ClassifyDefectsPage1 setCurrentPage={setCurrentPage} />;
      case 'duplicate':
        return <DuplicatesDetectionPage1 setCurrentPage={setCurrentPage} />;
      default:
        return <Header setCurrentPage={setCurrentPage} />;
    }
  };

  console.log('Current Page:', currentPage); // Log current page to check if it's updating

  return (
    <div>
      {renderPage()}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
