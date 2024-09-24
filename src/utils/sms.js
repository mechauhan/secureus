// Create an instance of Twilio Client
const client = new twilio(accountSid, authToken);

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}

module.exports = { generateOTP };
