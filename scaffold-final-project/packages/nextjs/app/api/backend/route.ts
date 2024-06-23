import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const searchparams = new URLSearchParams(url.searchParams);


    try {

        return NextResponse.json({ message: "hello" });
    } catch (error: any) {
        // Log error and send error message
        console.error(error.message);
        return NextResponse.json({ message: "error" });
    }
}