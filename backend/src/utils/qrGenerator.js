const QRCode = require('qrcode');

/**
 * Generates a base64 PNG data URL for a given public profile URL.
 * @param {String} textUrl - Public profile URL (e.g. kth.app/u/EMP-1001)
 * @returns {Promise<String>} Base64 Data URL string
 */
const generateQRCodeDataUrl = async (textUrl) => {
  try {
    return await QRCode.toDataURL(textUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 400,
      color: {
        dark: '#0f172a', // Slate 900
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('[QR Code Generation Error]:', error);
    // Fallback to Google Chart QR API URL if qrcode fails
    return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(textUrl)}&choe=UTF-8`;
  }
};

/**
 * Generates SVG string for QR Code.
 * @param {String} textUrl - Public profile URL
 * @returns {Promise<String>} SVG string
 */
const generateQRCodeSVG = async (textUrl) => {
  try {
    return await QRCode.toString(textUrl, { type: 'svg', margin: 2 });
  } catch (error) {
    console.error('[QR Code SVG Error]:', error);
    return '';
  }
};

module.exports = {
  generateQRCodeDataUrl,
  generateQRCodeSVG,
};
