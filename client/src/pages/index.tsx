import {Inter} from "next/font/google";
import {DynamicBridgeWidget, DynamicWidget} from "@dynamic-labs/sdk-react-core";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
  return (
    <div className="h-screen w-full bg-white">
      <div>hello</div>
      <DynamicBridgeWidget />
    </div>
  );
}
