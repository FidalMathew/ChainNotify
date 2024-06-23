import { NextResponse } from 'next/server';
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import { Novu } from '@novu/node';
dotenv.config();

const cronJobs: any = {};
const userEventStore: any = {};

const novu = new Novu(process.env.NEXT_PUBLIC_NOVU_API_KEY!);

const triggerNotification = async (
    subscriberId: string,
    email: string,
    userAddress: any,
    eventName: any,
    eventTitle: any,
    contractAddress: any
) => {
    try {
        const res = await novu.trigger('chainnotify', {
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



const generateCronJobKey = (userAddress: any, contractAddress: any, eventName: any) => {
    return `${userAddress}-${contractAddress}-${eventName}`;
};

export async function POST(req:
    { json: () => PromiseLike<{ userAddress: any; contractAddress: any; eventName: any; eventTitle: any; email: any; }> | { userAddress: any; contractAddress: any; eventName: any; eventTitle: any; email: any; }; }
) {
    const { userAddress, contractAddress, eventName, eventTitle, email } = await req.json();

    if (!userAddress || !contractAddress || !eventName) {
        return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);

    const job = cron.schedule('* * * * *', async () => {
        try {
            const url = `https://sepolia-api.voyager.online/beta/events?ps=10&p=1&contract=${contractAddress}`;
            const options = {
                headers: {
                    accept: 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_VOYAGER_API_KEY,
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

            const subscriberId = Math.random().toString(36).substring(7);

            newEvents.forEach(async (event: { eventId: any; }) => {
                console.log(`New event for ${userAddress}:`, event.eventId);
                // await triggerNotification(subscriberId, email, userAddress, eventName, eventTitle, contractAddress);
            });
        } catch (error) {
            console.error(error);
        }
    });

    cronJobs[jobKey] = {
        job: job,
        active: true,
    }

    return NextResponse.json({ jobKey });
}

export async function DELETE(req: { url: any; }) {
    const url = new URL(req.url)
    const userAddress = url.searchParams.get('userAddress');
    const contractAddress = url.searchParams.get('contractAddress');
    const eventName = url.searchParams.get('eventName');


    if (!userAddress || !contractAddress || !eventName) {
        return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);
    console.log('jobkey cronjobs in delete', cronJobs[jobKey],)
    if (cronJobs[jobKey]) {
        cronJobs[jobKey].job.stop();
        delete cronJobs[jobKey];
        return NextResponse.json({ message: `Cron job for ${jobKey} has been deleted.` });
    } else {
        return NextResponse.json({ error: `No cron job found for ${jobKey}.` }, { status: 404 });
    }
}

export async function GET(req: { url: any; }) {
    const url = new URL(req.url)
    const userAddress = url.searchParams.get('userAddress');
    const contractAddress = url.searchParams.get('contractAddress');
    const eventName = url.searchParams.get('eventName');


    if (!userAddress || !contractAddress || !eventName) {
        return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const jobKey = generateCronJobKey(userAddress, contractAddress, eventName);

    if (cronJobs[jobKey]) {
        return NextResponse.json({ active: cronJobs[jobKey].active });
    } else {
        return NextResponse.json({ active: false });
    }
}
