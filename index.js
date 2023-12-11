const express = require('express');
const cors = require('cors');
const excel = require('exceljs');
const pdfkit = require('pdfkit');
const fs = require('fs');
const path = require('path'); // Add this line
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
  const { num1, num2 } = req.body;

  // Perform calculations and save to Excel file
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.addRow(['Number 1', 'Number 2', 'Result']);
  worksheet.addRow([num1, num2, parseFloat(num1) + parseFloat(num2)]);

  const excelFileName = 'result.xlsx';
  workbook.xlsx.writeFile(excelFileName)
    .then(() => {
      // Convert Excel to PDF
      const pdfFileName = 'result.pdf';
      const pdfStream = fs.createWriteStream(pdfFileName);
      const pdfDoc = new pdfkit();
      pdfDoc.pipe(pdfStream);
      pdfDoc.text('Calculation Result');
      pdfDoc.text(`Number 1: ${num1}`);
      pdfDoc.text(`Number 2: ${num2}`);
      pdfDoc.text(`Result: ${parseFloat(num1) + parseFloat(num2)}`);
      pdfDoc.end();

      pdfStream.on('finish', () => {
        // Resolve the absolute path using path.resolve
        const absolutePath = path.resolve(pdfFileName);
        // Send the PDF as a response with the resolved absolute path
        res.sendFile(absolutePath);
        const result = parseFloat(num1) + parseFloat(num2);

  // Respond with JSON data
//   res.json({ result });
      });

      pdfStream.on('error', (err) => {
        res.status(500).send(err.message);
      });
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
    
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
