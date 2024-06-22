/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import type {NextPage} from "next";
import {BugAntIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {Address} from "~~/components/scaffold-stark";
import {useAccount} from "@starknet-react/core";
import {Address as AddressType} from "@starknet-react/chains";
import {ArrowRight, HomeIcon, LayoutDashboard} from "lucide-react";
import {useRouter} from "next/navigation";
import {
  DynamicBridgeWidget,
  DynamicWidget,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import {Field, Form, Formik} from "formik";
import {useScaffoldWriteContract} from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import {useEffect} from "react";
import {CustomConnectButton} from "~~/components/scaffold-stark/CustomConnectButton";

const Home: NextPage = () => {
  const connectedAddress = useAccount();
  const router = useRouter();
  console.log(connectedAddress.address, "connectedAddress");

  const {primaryWallet, user} = useDynamicContext();

  console.log(primaryWallet?.address, user, "user");

  useEffect(() => {
    if (connectedAddress.address && user) {
      router.push("/dashboard");
    }
  }, [connectedAddress, user, router]);

  return (
    <>
      <div className="bg-white h-screen w-full">
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
              Streamline Your Smart Contract&apos;s Event Management
            </p>
            <p className="text-slate-100 md:text-xl font-semibold max-w-xl">
              Effortlessly create, manage, and analyze your smart contracts
              event with our powerful platform.
            </p>

            <div className="flex flex-col gap-4 items-center">
              {!user && !connectedAddress.address ? (
                <DynamicWidget />
              ) : (
                user && !connectedAddress.address && <CustomConnectButton />
              )}
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
    </>
  );
};

export default Home;
