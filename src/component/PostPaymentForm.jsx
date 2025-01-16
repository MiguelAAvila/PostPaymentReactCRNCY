import React, { useContext, useState } from 'react';
import Papa from 'papaparse';
import { formatDate } from '../utils/dateFormatter';
import { PostPayment } from '../api/postPaymentApi';
import { useNavigate } from 'react-router-dom';
import { formatPaymentPayload } from '../utils/formatPostPaymentPayload';
import AuthContext from './AuthContext';

const PostPaymentForm = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [apiError, setApiError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [loadingRows, setLoadingRows] = useState([]); // Individual loading state per row
    const { logout } = useContext(AuthContext);

    const userId = localStorage.getItem('userId');
    const companyId = localStorage.getItem('companyId');
    const navigate = useNavigate();

    const handleFileChange = (event) => setCsvFile(event.target.files[0]);

    const handleParseCSV = async () => {
        if (!csvFile) {
            setApiError("Please select a CSV file.");
            return;
        }
        try {
            Papa.parse(csvFile, {
                skipEmptyLines: true,
                complete: (results) => {
                    setCsvData(results.data);
                    setApiError(null);
                },
                error: (error) => setApiError(`CSV parsing error: ${error.message}`),
            });
        } catch (error) {
            setApiError(`CSV parsing error: ${error.message}`);
        }
    };

    const handleProcessRow = async (rowData, rowIndex) => {
        setLoadingRows((prev) => [...prev, rowIndex]); // Set the row to loading
        try {
            const payload = formatPaymentPayload(rowData[0], rowData[1], rowData[2], formatDate(rowData[3]), userId, companyId);
            const response = await PostPayment(payload);
            await processResponse(response, rowData, rowIndex);
        } catch (error) {
            handleError(error, rowIndex);
        } finally {
            setLoadingRows((prev) => prev.filter((index) => index !== rowIndex)); // Remove the row from loading state
        }
    };

    const handleProcessAll = async () => {
        if (!csvData.length) {
            setApiError("Please upload a CSV file first.");
            return;
        }
        setApiResponse(null);
        setApiError(null);

        const rowPromises = csvData.map((row, index) => processRow(row, index));
        setLoadingRows(csvData.map((_, index) => index)); // Set all rows to loading
        const results = await Promise.all(rowPromises);
        updateRowsWithResults(results);
        setLoadingRows([]); // All rows processed, reset loading state
    };

    const processResponse = async (response, rowData, rowIndex) => {
        const updatedData = [...csvData];
        const status = response.status === 200 ? 'success' : 'error';
        const message = status === 'success'
            ? `Processed successfully for ${rowData[2]} for ${rowData[0]}`
            : `Error: ${response.message || 'Unknown error'}`;

        updatedData[rowIndex] = { ...updatedData[rowIndex], status, message };
        setCsvData(updatedData);
        if (status === 'success') {
            setApiResponse(`Payment for ${rowData[2]} for ${rowData[0]} processed successfully!`);
        }
        setApiError(null);
    };

    const handleError = (error, rowIndex) => {
        const updatedData = [...csvData];
        updatedData[rowIndex] = { ...updatedData[rowIndex], status: 'error', message: `Error: ${error.message}` };
        setCsvData(updatedData);
        setApiResponse(null);
        if (error.status === 401) navigate("/login");
    };

    const processRow = async (row, index) => {
        try {
            const payload = formatPaymentPayload(row[0], row[1], row[2], formatDate(row[3]), userId, companyId);
            const response = await PostPayment(payload);
            return { index, status: response.status === 200 ? 'success' : 'error', message: response.status === 200 ? `Processed successfully for ${row[2]} for ${row[0]}` : `Error: ${response.message || 'Unknown error'}` };
        } catch (error) {
            return { index, status: 'error', message: error.message };
        }
    };

    const updateRowsWithResults = (results) => {
        const updatedData = [...csvData];
        results.forEach(({ index, status, message }) => {
            updatedData[index] = { ...updatedData[index], status, message };
        });
        setCsvData(updatedData);

        const errorMessages = results.filter(result => result.status === 'error').map(result => result.message);
        if (errorMessages.length === 0) {
            setApiResponse("All payments processed successfully!");
        }
    };

    const headers = csvData.length > 0 ? ["Header ID", "Payment Amount", "Instrument Number", "Payment Date"] : [];

    return (
        <div className="w-screen h-screen">
            <div className="bg-violet-500 py-8 mb-5 flex justify-end">
                <div className="px-5 text-white">
                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-4">Post Payment from CSV</h1>
                <form onSubmit={(e) => e.preventDefault()} className="mb-4">
                    <div className="mb-4">
                        <label htmlFor="csvFile" className="block text-gray-700 font-bold mb-2">Upload CSV File:</label>
                        <input
                            type="file"
                            id="csvFile"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded w-full p-2"
                        />
                    </div>
                    <div className="flex flex-row justify-between">
                        <button type="button" onClick={handleParseCSV} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Parse CSV</button>
                        {csvData.length > 0 && (
                            <button type="button" onClick={handleProcessAll} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                {loadingRows.length > 0 ? <span className="spinner"><img style={{width: "25px", height: "25px"}} src='./icons/loading.png' alt='loading'/></span> : "Process All"}
                            </button>
                        )}
                    </div>
                </form>

                {csvData.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    {headers.map((header) => (
                                        <th key={header} className="border border-gray-300 px-4 py-2 text-left">{header}</th>
                                    ))}
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {csvData.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "" : "bg-gray-50"}>
                                        {headers.map((header, innerIndex) => (
                                            <td key={innerIndex} className="border border-gray-300 px-4 py-2">
                                                {row[innerIndex] !== undefined && row[innerIndex] !== null ? row[innerIndex].toString() : "-"}
                                            </td>
                                        ))}
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button 
                                                onClick={() => handleProcessRow(row, index)} 
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs mb-2"
                                                disabled={loadingRows.includes(index)} // Disable button if loading
                                            >
                                                {loadingRows.includes(index) ? <span className="spinner"><img style={{width: "25px", height: "25px"}} src='./icons/loading.png' alt='loading'/></span> : "Process"}
                                            </button>
                                            {row.status && (
                                                <span className={`flex flex-row ml-2 text-sm ${row.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {row.status === 'success' ? <img style={{width: "25px", height: "25px", marginRight: "5px"}} src='./icons/checked.png' alt='Success'/> : <img src='../../public/icons/warning.png' alt='Failed'/>} {row.message}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {apiError && (
                    <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 whitespace-pre-line">
                        {apiError}
                    </div>
                )}

                {apiResponse && (
                    <div className="mt-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostPaymentForm;
