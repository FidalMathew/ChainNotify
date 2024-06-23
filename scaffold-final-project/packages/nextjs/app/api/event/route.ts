import { NextResponse } from 'next/server';
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const cronJobs = {};


const generateCronJobKey = (userAddress: any, contractAddress: any, eventName: any) => {
    return `${userAddress}-${contractAddress}-${eventName}`;
};

export async function POST(req: { json: () => PromiseLike<{ userAddress: any; contractAddress: any; eventName: any; }> | { userAddress: any; contractAddress: any; eventName: any; }; }) {
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

            const newEvents = latestEvents.filter((event: { name: any; eventId: string; }) => {
                return event.name === eventName && !storedEventIds.has(event.eventId);
            });

            newEvents.forEach((event: { eventId: string; }) => {
                storedEventIds.add(event.eventId);
            });

            newEvents.forEach((event: { eventId: any; }) => {
                console.log(`New event for ${userAddress}:`, event.eventId);
                // triggerNotification(userAddress, event);
            });
        } catch (error) {
            console.error(error);
        }
    });

    cronJobs[jobKey] = job as String;

    return NextResponse.json({ jobKey });
}

export async function DELETE(req: { json: () => PromiseLike<{ userAddress: any; contractAddress: any; eventName: any; }> | { userAddress: any; contractAddress: any; eventName: any; }; }) {
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
