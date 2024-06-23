"use client";
import axios from "axios";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";

interface Event {
  fromAddress: string;
  // Add other properties of Event here
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [fromAddressData, setFromAddressData] = useState<
    {address: string; count: number}[]
  >([]);

  //   const eventName = "Transfer"; // Replace with the event name you want to display
  //     const contractAddress = "0x0"; // Replace with the contract address you want to display

  // fetch eventNAme and contractAddress from query parameters in the url
  const searchParams = useSearchParams();
  const eventName = searchParams.get("eventName");
  const contractAddress = searchParams.get("contractAddress");

  console.log(eventName, contractAddress, "testing");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/fetchEvents?contractAddress=${contractAddress}`
        );

        // console.log(res, "res");
        const filterArr = res.data.filter(
          (item: {name: string}) => item.name === eventName
        );

        console.log(filterArr, "filterArr");

        setEvents(filterArr);
        extractFromAddressData(filterArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (eventName && contractAddress) fetchData();
  }, [eventName, contractAddress]);

  const extractFromAddressData = (data: Event[]) => {
    const fromAddresses: string[] = data.map(
      (event: Event) => event.fromAddress
    );
    const uniqueFromAddresses = Array.from(new Set(fromAddresses));
    const addressData = uniqueFromAddresses.map((address) => ({
      address,
      count: fromAddresses.filter((addr) => addr === address).length,
    }));
    setFromAddressData(addressData);
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]; // Example colors, add more as needed

  console.log(fromAddressData, "fromAddressData");

  return (
    <div className="h-screen w-full">
      <div style={{width: "100%", height: 400}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={fromAddressData}
              dataKey="count"
              nameKey="address"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={renderCustomizedLabel}
            >
              {fromAddressData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
