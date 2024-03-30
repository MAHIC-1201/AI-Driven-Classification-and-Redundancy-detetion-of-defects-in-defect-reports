import React, { useState, useEffect, useRef } from 'react';

import './duplicate_detection_page1.css'; // Import the CSS file
import Chart from 'chart.js/auto';

function DuplicatesDetectionPage1({ setCurrentPage }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOldFile, setSelectedOldFile] = useState(null); // State for selected old report file
  const [selectedNewFile, setSelectedNewFile] = useState(null); // State for selected new report file
  const [results, setResults] = useState([]);
  const [percentageYes, setPercentageYes] = useState(0);
  const [percentageNo, setPercentageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
// State to store the results received from the backend

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setDropdownOpen(false);

    if (option === "DeviceOld") {
      document.getElementById('fileInputOld').click();
    } else if (option === "DeviceNew") {
      document.getElementById('fileInputNew').click();
    } else if (option === "GoogleDriveOld") {
      openGoogleDrivePicker();
    } else if (option === "GoogleDriveNew") {
      openGoogleDrivePicker();
    }
  };

  const openGoogleDrivePicker = () => {
    console.log("Opening Google Drive picker...");
    // Implement Google Drive picker logic here
  };

  const handleFileInputChange = (event, type) => {
    const file = event.target.files[0];
    if (type === 'old') {
      setSelectedOldFile(file); // Store the selected old report file in state
    } else if (type === 'new') {
      setSelectedNewFile(file); // Store the selected new report file in state
    }
  };

  const handleBackToHomeClick = () => {
    setCurrentPage('homepage');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    //setResults(null);

    const formData = new FormData();
    formData.append('target_file', selectedOldFile);
    formData.append('given_file', selectedNewFile);

    try {
      const response = await fetch('http://localhost:5000/detect_duplicates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setResults(JSON.parse(data.results));

        console.log(data);
     
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to compare reports');
    } finally {
      setLoading(false);
    }


  };

  useEffect(() => {
    if (!Array.isArray(results)) {
      return;
    }

    if (results.length > 0) {
      const totalYes = results.filter(item => item.Duplicate === 'Yes').length;
      const totalNo = results.filter(item => item.Duplicate === 'No').length;
      const totalCount = totalYes + totalNo;
      const percentYes = (totalYes / totalCount) * 100;
      const percentNo = (totalNo / totalCount) * 100;
      setPercentageYes(percentYes);
      setPercentageNo(percentNo);

      // Update pie chart
      const chartData = {
        labels: ['Yes', 'No'],
        datasets: [{
          label: 'Duplicates',
          data: [percentYes, percentNo],
          backgroundColor: ['#36A2EB', '#1008E9']
        }]
      };

      if (chartRef.current) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: chartData,
          options: {
            responsive: true
          }
        });
      }
    }
  }, [results, percentageYes, percentageNo]);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    const sortedResults = [...results].sort((a, b) => {
      if (newDirection === 'asc') {
        return a.Matched_Index - b.Matched_Index;
      } else {
        return b.Matched_Index - a.Matched_Index;
      }
    });
    setResults(sortedResults);
  };

  const filteredData = results.filter(item => item.Duplicate.toLowerCase().includes(filterValue.toLowerCase()));

  

  return (
    <div className="App">
      <header className="header">
        <div className="left">
          <p className="util">Util</p>
        </div>
        <div className="center">
          <p className="classifyDefects">Duplicate Detection</p>
        </div>
        <div className="right">
          <button className="homeButton" onClick={handleBackToHomeClick}>
            Back to Home
          </button>
        </div>
      </header>
      <main className="content">
        <p className="uploadText">Upload your excel files</p>
        <div className="dropdown">
          <button className="chooseFileButton" onClick={handleDropdownToggle}>
            Old Report
            {dropdownOpen ? (
              <span>&#9650;</span>
            ) : (
              <span>&#9660;</span>
            )}
          </button>
          <input id="fileInputOld" type="file" style={{ display: 'none' }} onChange={(event) => handleFileInputChange(event, 'old')} />
          {selectedOldFile && (
            <p>Selected Old Report file: {selectedOldFile.name}</p>
          )}
          {dropdownOpen && (
            <div className="dropdownContent">
              <p className="option" onClick={() => handleOptionClick("DeviceOld")}>
                Choose file from device (Old Report)
              </p>
              <p className="option" onClick={() => handleOptionClick("GoogleDriveOld")}>
                Choose file from Google Drive (Old Report)
              </p>
            </div>
          )}
        </div>
        <div className="dropdown">
          <button className="chooseFileButton" onClick={handleDropdownToggle}>
            New Report
            {dropdownOpen ? (
              <span>&#9650;</span>
            ) : (
              <span>&#9660;</span>
            )}
          </button>
          <input id="fileInputNew" type="file" style={{ display: 'none' }} onChange={(event) => handleFileInputChange(event, 'new')} />
          {selectedNewFile && (
            <p>Selected New Report file: {selectedNewFile.name}</p>
          )}
          {dropdownOpen && (
            <div className="dropdownContent">
              <p className="option" onClick={() => handleOptionClick("DeviceNew")}>
                Choose file from device (New Report)
              </p>
              <p className="option" onClick={() => handleOptionClick("GoogleDriveNew")}>
                Choose file from Google Drive (New Report)
              </p>
            </div>
          )}
        </div>
        <button className="Comparebutton" onClick={handleSubmit} disabled={!selectedOldFile || !selectedNewFile || loading}>
          {loading ? 'Comparing...' : 'Compare Reports'
          }
        </button>
        {results.length > 0 && (
        <div className='ResultsTable'>
          <div className='filter'>
            <input type="text" placeholder="Search any defect" value={filterValue} onChange={handleFilterChange} />
          </div>
          <div className="Results">
            <h2>Results:</h2>
            
            <table>
              <thead >
                <tr>
                  <th>Sentence</th>
                  <th>Duplicate</th>
                  <th onClick={handleSort} style={{ cursor: 'pointer' }}>Matched_Index</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Sentence}</td>
                    <td>{item.Duplicate}</td>
                    <td>{item.Matched_Index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="Chart">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      )}
       
        
      </main>
    </div>
  );
}

export default DuplicatesDetectionPage1;
