const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const dotenv = require("dotenv");
const cors = require("cors");
const { Novu } = require("@novu/node");
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Define your routes here

app.use(express.json());
app.use(cors());

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
// In-memory store for previously seen events
const userEventStore = {};

// Helper function to generate a unique key for each job
const generateCronJobKey = (userAddress, contractAddress, eventName) => {
  return `${userAddress}-${contractAddress}-${eventName}`;
};

// Endpoint to set a cron job
app.post("/setEvent", (req, res) => {
  const { userAddress, contractAddress, eventName } = req.body;

  if (!userAddress || !contractAddress || !eventName) {
    return res.status(400).send("Missing required parameters.");
  }

  const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);

  // Create and store the cron job
  const job = cron.schedule("*/1 * * * *", async () => {
    try {
      const { userAddress, eventName, contractAddress } = req.body;
      console.log(
        `Fetching events for ${eventName} on contract ${contractAddress} for user ${userAddress}`
      );

      const url = `https://api.voyager.online/beta/events?ps=10&p=1&contract=${contractAddress}`;
      const options = {
        headers: {
          accept: "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_VOYAGER_API_KEY,
        },
      };

      const jobKey = `${userAddress}-${contractAddress}-${eventName}`;
      console.log(jobKey, "Created job key");

      const response = await axios.get(url, options);
      const latestEvents = response.data.items;

      // Initialize user event store if not present
      if (!userEventStore[userAddress]) {
        userEventStore[userAddress] = new Set();
      }

      const storedEventIds = userEventStore[userAddress];

      // Filter out new events
      const newEvents = latestEvents.filter((event) => {
        return event.name === eventName && !storedEventIds.has(event.eventId);
      });

      // Store new event IDs
      newEvents.forEach((event) => {
        storedEventIds.add(event.eventId);
      });

      // Trigger notifications for new events (implementation depends on your notification system)
      newEvents.forEach((event) => {
        console.log(`New event for ${userAddress}:`, event.eventId);
        // triggerNotification(userAddress, event); // Uncomment and implement this function as needed
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  });

  cronJobs[jobKey] = job;

  res.json(jobKey).status(200);
});

const novu = new Novu(process.env.NEXT_PUBLIC_NOVU_API_KEY);

const triggerNotification = async (
  subscriberId,
  email,
  userAddress,
  eventName,
  eventTitle,
  contractAddress
) => {
  console.log(novu);

  try {
    const res = await novu.trigger("chainnotify", {
      to: {
        subscriberId: subscriberId,
        email: email,
      },
      payload: {
        eventName: eventName,
        eventTitle: eventTitle,
        userAddresss: userAddress,
        contractAddress: contractAddress,
      },
    });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

app.post("/testNotification", async (req, res) => {
  const subscriberId = "dasdas";
  const email = "fidal15perfect@gmail.com";
  const { userAddress, eventTitle, eventName, contractAddress } = req.body;

  try {
    triggerNotification(
      subscriberId,
      email,
      userAddress,
      eventName,
      eventTitle,
      contractAddress
    );
    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/test", async (req, res) => {
  try {
    const { userAddress, eventName, contractAddress } = req.body;
    console.log(
      `Fetching events for ${eventName} on contract ${contractAddress} for user ${userAddress}`
    );

    const url = `https://api.voyager.online/beta/events?ps=10&p=1&contract=${contractAddress}`;
    const options = {
      headers: {
        accept: "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_VOYAGER_API_KEY,
      },
    };

    const jobKey = `${userAddress}-${contractAddress}-${eventName}`;
    console.log(jobKey, "Created job key");

    const response = await axios.get(url, options);
    const latestEvents = response.data.items;

    // Initialize user event store if not present
    if (!userEventStore[userAddress]) {
      userEventStore[userAddress] = new Set();
    }

    const storedEventIds = userEventStore[userAddress];

    // Filter out new events
    const newEvents = latestEvents.filter((event) => {
      return event.name === eventName && !storedEventIds.has(event.eventId);
    });

    // Store new event IDs
    newEvents.forEach((event) => {
      storedEventIds.add(event.eventId);
    });

    // Trigger notifications for new events (implementation depends on your notification system)
    newEvents.forEach((event) => {
      console.log(`New event for ${userAddress}:`, event.eventId);
      // triggerNotification(userAddress, event); // Uncomment and implement this function as needed
    });

    res.status(200).json(newEvents);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
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
