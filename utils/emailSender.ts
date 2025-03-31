import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const testResultsPath = path.join(__dirname, '../playwright-report/test-results.json');
let passed = 0;
let failed = 0;

// Define constants for email configuration
const SENDER_EMAIL = "automationreport477@gmail.com";
const SENDER_PASSWORD = "jepg jwti wkdb lajf";
const RECEIVER_EMAIL = "harshvyas2216@gmail.com";


function getTestResults() {
  const data = fs.readFileSync(testResultsPath, 'utf8');
  const testResults = JSON.parse(data);
  for (let i = 0; i < testResults.suites[0].suites[0].specs.length; i++) {
    const result = testResults.suites[0].suites[0].specs[i].tests[0].results[0].status;
    if (result === "passed") {
      passed += 1;
    } else if (result === "failed") {
      failed += 1;
    }
    console.log(`Passed: ${passed}, Failed: ${failed}`);
  }
}
getTestResults()


// const resultsFilePath = path.resolve(__dirname, '../test-results/testResults.json');  
  const reportHtmlPath ="playwright-report/index.html"; 
  console.log("--Sending Mail......")
  sendEmail("Test Execution Report", reportHtmlPath, 
    passed, 
    failed, 
    ["results"], 
    "114.0.5735.90" 
  );


// Function to prepare the email body (returns a string)
function prepareEmailBody(passed: number, failed: number, results: any[], browserVersion: string): string {
    return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        table {
          width: 60%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #2C3E50;
          color: white;
          font-weight: bold;
        }
        td {
          background-color: #f9f9f9;
        }
        .green {
          background-color: #D4EDDA;
          color: #155724;
          font-weight: bold;
        }
        .red {
          background-color: #F8D7DA;
          color: #721C24;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h2>Automation Test Execution Report</h2>
      <table class="summary-table">
        <tr><th>Summary</th><th>Details</th></tr>
        <tr><td>Project Name</td><td>SauceDemo</td></tr>
        <tr><td>Test Type</td><td>Automation</td></tr>
        <tr><td>Browser Used</td><td>Chrome</td></tr>
        <tr><td>Browser Version</td><td>${browserVersion}</td></tr>
        <tr><td>Tests Passed</td><td>${passed}</td></tr>
        <tr><td>Tests Failed</td><td>${failed}</td></tr>
        <tr><td>Total Test Cases</td><td>${passed + failed}</td></tr>
      </table>

    </body>
    </html>
    `;
}



// Function to send an email with attachments (HTML report)
export async function sendEmail(subject: string, reportHtmlPath: string, passed: number, failed: number, results: any[], browserVersion: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD
        }
    });

    // Prepare the email body using the passed and failed test results
    const emailBody = prepareEmailBody(passed, failed, results, browserVersion);

    const message = {
        from: SENDER_EMAIL,
        to: RECEIVER_EMAIL,
        subject: subject,
        html: emailBody, // Use the prepared HTML as the email body
        attachments: [] as { filename: string, content: Buffer }[] // Attachments array
    };


    // Attach HTML report as a buffer (if the report file exists)
    if (fs.existsSync(reportHtmlPath)) {
        const htmlBuffer = fs.readFileSync(reportHtmlPath); // Read file as Buffer
        message.attachments.push({
            filename: path.basename(reportHtmlPath),
            content: htmlBuffer // Attach the buffer content
        });
    } else {
        console.error(`Error: Report HTML file not found at: ${reportHtmlPath}`);
    }

    // Send the email with attachments and the HTML body
    try {
        await transporter.sendMail(message);
        console.log("Email sent successfully with the HTML body and attachments.");
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}
