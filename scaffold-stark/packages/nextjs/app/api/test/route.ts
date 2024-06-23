import { NextResponse } from 'next/server';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const userEventStore: { [key: string]: Set<string> } = {};

export async function GET(req: { json: () => PromiseLike<{ userAddress: any; eventName: any; contractAddress: any; }> | { userAddress: any; eventName: any; contractAddress: any; }; }) {
    const { userAddress, eventName, contractAddress } = await req.json();

    try {
        const url = `https://api.voyager.online/beta/events?ps=10&p=1&contract=${contractAddress}`;
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

        newEvents.forEach((event: { eventId: any; }) => {
            console.log(`New event for ${userAddress}:`, event.eventId);
        });

        return NextResponse.json(newEvents);
    } catch (error) {
        console.error((error as Error)?.message);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
