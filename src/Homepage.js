// import React from 'react';
// import logo from './person_logo.jpg'; // Assuming logo is in JPG format
// import teamImage from './Types-of-software-bugs.jpg'; // Assuming teamImage is in JPG format

// function Homepage() {
//   return (
//     <div>
//       {/* Header section */}
//       <header style={styles.header}>
//         <div style={styles.leftContent}>
//           <h1 style={styles.title}>UTIL</h1>
//         </div>
//         <div>
//           <img src={logo} alt="Person Logo" style={styles.logo} />
//           <button style={styles.button}>LOGIN</button>
//           <button style={styles.button}>SIGNUP</button>
          
//         </div>
//       </header>

//       {/* Content section */}
//       <div style={styles.content}>
//         <div style={styles.buttonsContainer}>
//           <button style={styles.bigButton}>Classify Defects</button>
//           <button style={styles.bigButton}>Find Similar Defects</button>
//         </div>
//         <img src={teamImage} alt="Team Working" style={styles.teamImage} />
//       </div>
//     </div>
//   );
// }

// import React from 'react';
// import logo from './person_logo.jpg';
// import teamImage from './Types-of-software-bugs.jpg';

// function Homepage({ setCurrentPage }) {
//   const handleClassifyButtonClick = () => {
//     setCurrentPage('classify'); // Set current page to 'classify' when the button is clicked
//   };
//   const handleDuplicateButtonClick = () => {
//     setCurrentPage('duplicate'); // Set current page to 'classify' when the button is clicked
//   };

//   return (
//     <div>
//       <header style={styles.header}>
//         <div style={styles.leftContent}>
//           <h1 style={styles.title}>UTIL</h1>
//         </div>
//         <div>
//           <img src={logo} alt="Person Logo" style={styles.logo} />
//           <button style={styles.button}>LOGIN</button>
//           <button style={styles.button}>SIGNUP</button>
//         </div>
//       </header>
//       <div style={styles.content}>
//         <div style={styles.buttonsContainer}>
//           {/* Call handleClassifyButtonClick function when the button is clicked */}
//           <button style={styles.bigButton} onClick={handleClassifyButtonClick}>
//             Classify Defects
//           </button>
//           <button style={styles.bigButton} onClick={handleDuplicateButtonClick}>
//             Find Similar Defects
//           </button>
//           {/* <button style={styles.bigButton}>Find Similar Defects</button> */}
//         </div>
//         <img src={teamImage} alt="Team Working" style={styles.teamImage} />
//       </div>
//     </div>
//   );
// }

// const styles = {
//   header: {
//     backgroundColor: 'black',
//     color: 'white',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '10px 20px',
//   },
//   leftContent: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   title: {
//     margin: 0,
//     fontSize: '50px',
//     marginRight: '15px',
//   },
//   logo: {
//     //alignItems: 'center',
//     width: '50px',
//     marginLeft: '10px',
//     marginRight: '10px',
//     paddingTop: '10px',
    
    
//   },
//   button: {
//     //alignItems: 'center',
//     marginTop: '10px',
//     backgroundColor: 'transparent',
//     color: 'white',
//     border: '1px solid white',
//     borderRadius: '5px',
//     padding: '16px 32px',
//     marginLeft: '10px',
//     cursor: 'pointer',
//   },
//   content: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '20px',
    
//   },
//   buttonsContainer: {
//     textAlign: 'center',
//     marginRight: '20px',
//   },
//   bigButton: {
//     backgroundColor: 'blue',
//     color: 'black',
//     border: 'none',
//     borderRadius: '10px',
//     padding: '30px 60px',
//     margin: '10px 0',
//     fontSize: '24px',
//     cursor: 'pointer',
//   },
//   teamImage: {
//     width: '700px',
//     height: '500px',
//   },
// };

// export default Homepage;

import React from 'react';
import logo from './person_logo.jpg';
import teamImage from './Types-of-software-bugs.jpg';

function Homepage({ setCurrentPage }) {
  const handleClassifyButtonClick = () => {
    setCurrentPage('classify'); // Set current page to 'classify' when the button is clicked
  };
  const handleDuplicateButtonClick = () => {
    setCurrentPage('duplicate'); // Set current page to 'classify' when the button is clicked
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.leftContent}>
          <h1 style={styles.title}>UTIL</h1>
        </div>
        <div style={styles.rightContent}>
          <img src={logo} alt="Person Logo" style={styles.logo} />
          <button style={styles.button}>LOGIN</button>
          <button style={styles.button}>SIGNUP</button>
        </div>
      </header>
      <div style={styles.content}>
        <div style={styles.buttonsContainer}>
          <button style={styles.bigButton} onClick={handleClassifyButtonClick}>
            Classify Defects
          </button>
          <button style={styles.bigButton} onClick={handleDuplicateButtonClick}>
            Find Similar Defects
          </button>
        </div>
        <img src={teamImage} alt="Team Working" style={styles.teamImage} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#333',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderRadius: '15px',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
  },
  leftContent: {
    display: 'flex',
    alignItems: 'center',
  },
  rightContent: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '40px',
    marginRight: '15px',
  },
  logo: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  },
  button: {
    marginTop: '10px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '5px',
    padding: '10px 20px',
    marginLeft: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },
  buttonHover: {
    backgroundColor: 'white',
    color: 'black',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '20px',
  },
  buttonsContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  bigButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '20px 40px',
    margin: '5px',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  bigButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
  },
  teamImage: {
    width: '100%',
    height: '70%',
    //height: 'auto',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
    //marginTop: '30px',
  },
};

export default Homepage;

