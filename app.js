const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import the cors package

const app = express();
app.use(express.json());  // For parsing JSON requests

// Enable CORS for all routes and origins
app.use(cors());

// Set up a POST endpoint to receive Storyline data
app.post('/checkGrammar', async (req, res) => {
  const { TextEntry, targetLang, helpLang, username } = req.body;

  // Check if required variables are provided
  if (!TextEntry || !targetLang || !helpLang || !username) {
    return res.status(400).json({ error: 'TextEntry, targetLang, helpLang, and username are required' });
  }

  try {
    // Send the POST request to LanguageTool API with form-encoded data
    const response = await axios.post('https://api.languagetoolplus.com/v2/check',
      new URLSearchParams({
        text: TextEntry,           // The text to be checked
        language: targetLang,      // Language to be checked
        motherTongue: helpLang,    // Native language for better suggestions
        username: username,        // Username for the API
        apiKey: '85436a46213e70c3',    // API key (ensure you provide your valid key)
        enabledOnly: 'false',      // EnabledOnly parameter, as in the example
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        }
      }
    );

    // Send the grammar check response back to the client (Storyline)
    res.json(response.data);
  } catch (error) {
    console.error('Error communicating with LanguageTool API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error checking grammar' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
