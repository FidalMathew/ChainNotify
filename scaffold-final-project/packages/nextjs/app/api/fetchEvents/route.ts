import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: { url: string }) {

    const url = new URL(req.url)

    const contractAddress = url.searchParams.get('contractAddress');
    const eventName = url.searchParams.get('eventName');

    console.log(contractAddress, eventName, "testing")


    try {
        const url = `https://sepolia-api.voyager.online/beta/events?ps=10&p=1&contract=${contractAddress}`;
        const options = {
            headers: {
                accept: 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_VOYAGER_API_KEY,
            },
        };

        const response = await axios.get(url, options);
        const latestEvents: any[] = response.data.items;

        return NextResponse.json(latestEvents);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
