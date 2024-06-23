import { NextResponse } from 'next/server';
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const cronJobs = {};
const userEventStore = {};

const generateCronJobKey = (userAddress, contractAddress, eventName) => {
    return `${userAddress}-${contractAddress}-${eventName}`;
};

export async function POST(req) {
    const { userAddress, contractAddress, eventName } = await req.json();

    if (!userAddress || !contractAddress || !eventName) {
        return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);

    const job = cron.schedule('*/1 * * * *', async () => {
        try {
            const url = `https://api.voyager.online/beta/events?ps=10&p=1&contract=${contractAddress}`;
            const options = {
                headers: {
                    accept: 'application/json',
                    'x-api-key': process.env.NEXT_VOYAGER_API_KEY,
                },
            };

            const response = await axios.get(url, options);
            const latestEvents = response.data.items;

            if (!userEventStore[userAddress]) {
                userEventStore[userAddress] = new Set();
            }

            const storedEventIds = userEventStore[userAddress];

            const newEvents = latestEvents.filter((event) => {
                return event.name === eventName && !storedEventIds.has(event.eventId);
            });

            newEvents.forEach((event) => {
                storedEventIds.add(event.eventId);
            });

            newEvents.forEach((event) => {
                console.log(`New event for ${userAddress}:`, event.eventId);
                // triggerNotification(userAddress, event);
            });
        } catch (error) {
            console.error(error.message);
        }
    });

    cronJobs[jobKey] = job;

    return NextResponse.json({ jobKey });
}

export async function DELETE(req) {
    const { userAddress, contractAddress, eventName } = await req.json();

    if (!userAddress || !contractAddress || !eventName) {
        return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);

    if (cronJobs[jobKey]) {
        cronJobs[jobKey].stop();
        delete cronJobs[jobKey];
        return NextResponse.json({ message: `Cron job for ${jobKey} has been deleted.` });
    } else {
        return NextResponse.json({ error: `No cron job found for ${jobKey}.` }, { status: 404 });
    }
}
