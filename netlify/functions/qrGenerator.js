const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
exports.handler = async (event) => {
  const { queryStringParameters } = event;
  const { data } = queryStringParameters;
  if (!data) {
    return {
      statusCode: 400,
      body: 'No data provided.',
    };
  }
  try {
    const qrDataURL = await QRCode.toDataURL(decodeURIComponent(data));
    const base64Data = qrDataURL.split(';base64,').pop();
    const filename = `qr-${Date.now()}.png`;
    const filepath = path.join('/tmp', filename); // Używamy /tmp dla Netlify Functions
    fs.writeFileSync(filepath, base64Data, { encoding: 'base64' });
    // Zwracamy Data URL zamiast zapisywać i udostępniać plik
    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl: qrDataURL }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Error generating QR code.',
    };
  }
};
