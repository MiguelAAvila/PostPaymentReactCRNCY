
# Post Payment from CSV - React Application

This is a React application that allows users login, upload a CSV file, parse it, and process payments by sending the data to an API. The application provides functionality for processing individual rows or processing all rows at once. It also shows loading indicators and error messages as needed.

## Prerequisites
Before you can run this application, make sure you have the following installed on your machine:

- **Node.js** (v14.x or later)  
  You can download and install Node.js from [here](https://nodejs.org/).
  
- **npm** (Node Package Manager)  
  npm is included with Node.js, so installing Node.js will also install npm.

## Getting Started
Follow these steps to get the application running on your local machine.

### 1. Clone the Repository

First, clone the repository to your local machine. Open your terminal and run the following command:

```bash
git clone https://github.com/MiguelAAvila/PostPaymentReactCRNCY
```
### 2. Navigate to the Project Directory
After cloning the project, navigate into the project directory:

``` bash 
cd PostPaymentReactCRNCY 
```

### 3. Install Dependencies
Once inside the project directory, install all the required dependencies by running:

``` bash 
npm install 
```
This will install all the packages listed in the package.json file.


### 4. Start the Development Server
To start the application locally, run the following command:

``` bash 
npm start 
```
This will start the React development server and automatically open the app in your default browser. The application will be available at http://localhost:3000/.

### 5. Login with given credentials
Once you navigate to http://localhost:3000/, you will be prompt to login, please enter the correct username and password. 

### 6. Uploading CSV File

Once you successfully log in, please upload the CSV file for the payment with the correct information. The CSV file should be in the following order:

1. **Header ID** – The unique loan ID for the loan in the LMS.
2. **Payment Amount** – The amount to be posted to the loan.
3. **Instrument Number** – A comment added to the transaction in the LMS.
4. **Payment Date** – The date the transaction should be posted as (can be a previous date).

### 7. Parsing the data from the upload CSV File

Once the csv file is uploaded, please click **Parse CSV**   

### 8. Sending the data to the CRNCY System

Once the data is corrected parsed, please ensure that the table is displaying correct the data according to the header. Once the data is verified, you can upload the data to CRNCY system via two ways: 

1. **Individually** – The system allows the user to upload individually the records via the Action section **Process**.
2. **Process All** – The system allows the user to upload all the records at once.