const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page to your HTML
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HTML to PDF</title>
      <!-- Add your CSS styles here -->
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello, World!</h1>
        <p>This is a sample HTML content.</p>
      </div>
    </body>
    </html>
  `);

  // Generate PDF from the rendered HTML
  await page.pdf({ path: 'example.pdf', format: 'A4' });

  await browser.close();
})();
