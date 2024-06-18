import {Inter} from "next/font/google";
import {DynamicBridgeWidget, DynamicWidget} from "@dynamic-labs/sdk-react-core";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
  return (
    <div className={`h-screen w-full font-Poppins`}>
      <div className="h-[60px] w-full flex items-center px-10 bg-white">
        <p className={`text-xl font-bold tracking-wide font-Poppins`}>
          ChainNotify
        </p>
      </div>
      <div
        className="flex justify-center items-center text-center p-5 bg-blue-900 text-white relative"
        style={{
          height: "calc(100vh - 60px)",
        }}
      >
        <div className="flex justify-center items-center flex-col gap-8 p-6 max-w-6xl">
          <p className="text-5xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Streamline Your Smart Contract Management
          </p>
          <p className="text-slate-100 md:text-xl font-semibold max-w-xl">
            Effortlessly create, manage, and analyze your smart contracts with
            our powerful platform.
          </p>

          <div className="flex flex-col gap-4">
            <DynamicBridgeWidget />
            <div className="text-sm flex justify-center items-center gap-2">
              <p>Powered by</p>
              <img src="/dynamic.png" alt="dynamic" className="w-24" />
            </div>
          </div>
        </div>

        {/* <div className="absolute bottom-0 left-0">
          <img src="/blockchain.png" alt="blockchain" className=" w-[35rem]" />
        </div> */}
      </div>
    </div>
  );
}
