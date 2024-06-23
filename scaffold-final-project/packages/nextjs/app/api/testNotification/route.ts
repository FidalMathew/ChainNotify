import { NextResponse } from 'next/server';
import { Novu } from '@novu/node';
import dotenv from 'dotenv';
dotenv.config();

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

export async function POST(req: { json: () => PromiseLike<{ userAddress: any; eventTitle: any; eventName: any; contractAddress: any; }> | { userAddress: any; eventTitle: any; eventName: any; contractAddress: any; }; }) {
    const { userAddress, eventTitle, eventName, contractAddress } = await req.json();
    const subscriberId = "deydey";
    const email = "jaydeep.dey03@gmail.com";

    try {
        await triggerNotification(subscriberId, email, userAddress, eventName, eventTitle, contractAddress);
        return NextResponse.json({ message: "Notification sent" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
