import React, { useState, useEffect } from 'react';
import './classify_defects_page1.css'; // Import the CSS file

function ClassifyDefectsPage1({ setCurrentPage }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory1, setFilterCategory1] = useState('');
  const [filterCategory2, setFilterCategory2] = useState('');
  const [uniqueCategories, setUniqueCategories] = useState({});
  const [finalResultsFileUrl, setFinalResultsFileUrl] = useState(null);

  useEffect(() => {
    // Extract unique categories for Category 1 and Category 2
    const category1Set = new Set(results.map(item => item.Category1));
    const category2Set = new Set(results.map(item => item.Category2));
    setUniqueCategories({ category1: Array.from(category1Set), category2: Array.from(category2Set) });
  }, [results]);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setDropdownOpen(false);

    if (option === "Device") {
      document.getElementById('fileInput').click();
    } else if (option === "Google Drive") {
      openGoogleDrivePicker();
    }
  };

  const openGoogleDrivePicker = () => {
    console.log("Opening Google Drive picker...");
    // Implement Google Drive picker logic here
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    setFileToUpload(selectedFile);
  };

  const handleUploadButtonClick = async () => {
    if (fileToUpload) {
      console.log("Uploading file:", fileToUpload.name);
      try {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        console.log("data");
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        console.log("Upload response:", data);
        setResults(data);
        console.log(data);
        document.getElementById('fileInput').value = '';
        setSelectedFileName(null);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.log("No file selected.");
    }
  };

  const handleBackToHomeClick = () => {
    setCurrentPage('homepage');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategory1FilterChange = (event) => {
    setFilterCategory1(event.target.value);
  };

  const handleCategory2FilterChange = (event) => {
    setFilterCategory2(event.target.value);
  };

  const filteredResults = results.filter(item =>
    (item.Summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Category1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Category2.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterCategory1 === '' || item.Category1 === filterCategory1) &&
    (filterCategory2 === '' || item.Category2 === filterCategory2)
  );

  const downloadResultsAsExcel = () => {
    const csvData = results.map(item => ({
      'Issue Summary': item.Summary,
      'Category 1': item.Category1,
      'Category 2': item.Category2
    }));

    const csvContent = "data:text/csv;charset=utf-8," +
      csvData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    setFinalResultsFileUrl(encodedUri);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="left">
          <p className="util">UTIL</p>
        </div>
        <div className="center">
          <p className="classifyDefects">Classify Defects</p>
        </div>
        <div className="right">
          <button className="homeButton" onClick={handleBackToHomeClick}>
            Back to Home
          </button>
        </div>
      </header>
      <main className="content">
        <p className="uploadText">Upload your excel file of defect report</p>
        <div className="dropdown">
          <button className="chooseFileButton" onClick={handleDropdownToggle}>
            Choose File
            {dropdownOpen ? (
              <span>&#9650;</span>
            ) : (
              <span>&#9660;</span>
            )}
          </button>
          <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileInputChange} />
          <div className="selectedFileName">{selectedFileName}</div>
          {dropdownOpen && (
            <div className="dropdownContent">
              <p className="option" onClick={() => handleOptionClick("Device")}>
                Choose file from device
              </p>
              <p className="option" onClick={() => handleOptionClick("Google Drive")}>
                Choose file from Google Drive
              </p>
            </div>
          )}
        </div>
        <button className="uploadButton" onClick={handleUploadButtonClick}>Upload</button>
        {results.length > 0 && (
          <>
            <div className="searchContainer">
              <input type="text" placeholder="Search any defect" onChange={handleSearchInputChange} />
            </div>
            <div className="filterContainer">
              <label htmlFor="category1">Category 1:</label>
              <select id="category1" onChange={handleCategory1FilterChange} value={filterCategory1}>
                <option value="">All</option>
                {/* Render unique options for Category 1 */}
                {uniqueCategories.category1 && uniqueCategories.category1.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <label htmlFor="category2">Category 2:</label>
              <select id="category2" onChange={handleCategory2FilterChange} value={filterCategory2}>
                <option value="">All</option>
                {/* Render unique options for Category 2 */}
                {uniqueCategories.category2 && uniqueCategories.category2.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button className="downloadButton" onClick={downloadResultsAsExcel}>Download Results as Excel</button>
            {finalResultsFileUrl && (
              <div className="downloadLinkContainer">
                <a href={finalResultsFileUrl} download="final_results.csv">Download Final Results</a>
              </div>
            )}
          </>
        )}
        {filteredResults.length > 0 && (
          <div className='ResultsTable'>
            <div className="Results">
              <h2>Results:</h2>
              <table>
                <thead >
                  <tr>
                    <th>Issue Summary  </th>
                    <th>Category 1  </th>
                    <th>Category 2</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Summary}</td>
                      <td>{item.Category1}</td>
                      <td>{item.Category2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClassifyDefectsPage1;
