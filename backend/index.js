const express = require("express");
const axios = require("axios");
const cron = require("node-cron");

const app = express();
const port = process.env.PORT || 8000;

// Define your routes here

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ChainNotify!");
});

app.post("/getEventNames", (req, res) => {
  const { abi } = req.body;

  const eventNames = abi
    .filter((item) => item.type === "event")
    .map((item) => item.name);

  res.json(eventNames).status(200);
});

// Store cron jobs in an object
const cronJobs = {};

// Helper function to generate a unique key for each job
const generateCronJobKey = (userAddress, contractAddress, eventName) => {
  return `${userAddress}-${contractAddress}-${eventName}`;
};

// Endpoint to set a cron job
app.post("/setEvent", (req, res) => {
  const { userAddress, contractAddress, eventName } = req.body;

  const fetchUrl = "url";

  if (!userAddress || !contractAddress || !eventName || !fetchUrl) {
    return res.status(400).send("Missing required parameters.");
  }

  const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);

  // Create and store the cron job
  const job = cron.schedule("*/5 * * * *", async () => {
    try {
      const response = await axios.get(fetchUrl);
      const latestEvents = response.data;

      // Your logic to handle new events goes here
      console.log(`Fetched latest events for ${jobKey}:`, latestEvents);
    } catch (error) {
      console.error(`Error fetching events for ${jobKey}:`, error);
    }
  });

  // Store the job using the unique key
  cronJobs[jobKey] = job;

  res.send(
    `Cron job has been set to fetch events every 5 minutes for ${jobKey}.`
  );
});

// Endpoint to delete a cron job
app.delete("/deleteEvent", (req, res) => {
  const { userAddress, contractAddress, eventName } = req.body;

  if (!userAddress || !contractAddress || !eventName) {
    return res.status(400).send("Missing required parameters.");
  }

  const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);

  // Check if the job exists
  if (cronJobs[jobKey]) {
    // Stop and delete the cron job
    cronJobs[jobKey].stop();
    delete cronJobs[jobKey];

    res.send(`Cron job for ${jobKey} has been deleted.`);
  } else {
    res.status(404).send(`No cron job found for ${jobKey}.`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
