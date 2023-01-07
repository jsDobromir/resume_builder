const puppeteer =require('puppeteer');


module.exports = async function(html= "") {
  const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({format: 'a4'});

    await page.close();
    await browser.close();

    return pdfBuffer;
}