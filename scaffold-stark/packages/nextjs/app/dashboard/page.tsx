/* eslint-disable react-hooks/rules-of-hooks */
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
import {Field, Form, Formik, FormikValues} from "formik";
import {useScaffoldWriteContract} from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import {useEffect, useState} from "react";
import {CustomConnectButton} from "~~/components/scaffold-stark/CustomConnectButton";
import {useScaffoldReadContract} from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import {useScaffoldContract} from "~~/hooks/scaffold-stark/useScaffoldContract";

const Dashboard: NextPage = () => {
  const connectedAddress = useAccount();
  const router = useRouter();
  console.log(connectedAddress.address, "connectedAddress");

  const {writeAsync: setValueFunctionName} = useScaffoldWriteContract({
    contractName: "YourContract2",
    functionName: "set_value",
    args: ["fidal", "fidal", "fidal", "fidal"],
  });

  const {data: totalCounter} = useScaffoldReadContract({
    contractName: "YourContract2",
    functionName: "get_value",
    // args: [""],
  });

  const {data: yourContract2} = useScaffoldContract({
    contractName: "YourContract2",
  });

  // useEffect(() => {
  //   const fetchEventDetails = async () => {
  //     try {
  //       // Retrieve the event title for the event with ID 1

  //       try {
  //         const tokenId = await yourContract2?.functions["get_eventTitle"](
  //           BigInt(1)
  //         );

  //         console.log("Event title:", tokenId);
  //       } catch (e) {
  //         console.error("Error fetching event title:", e);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching event title:", error);
  //     }
  //   };

  //   fetchEventDetails();
  // }, []);

  const {primaryWallet} = useDynamicContext();

  useEffect(() => {
    (async function () {
      const signature = await primaryWallet?.connector.signMessage("hello");
      console.log("signature", signature);
    })();
  }, [primaryWallet?.connector]);

  const handleSetValue = async (values: FormikValues) => {
    try {
      const result = await setValueFunctionName({
        args: [
          values.contractAddress,
          values.eventName,
          values.eventTitle,
          values.chain,
        ],
      });
      console.log("Transaction successful:", result);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const {user} = useDynamicContext();
  useEffect(() => {
    // route to / if user is not present or connectedAddress is not present
    if (!user || !connectedAddress) {
      router.push("/");
    }
  }, [user, connectedAddress, router]);
  return (
    <>
      <div className="bg-white h-screen w-full">
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box w-11/12 max-w-5xl h-fit px-10 py-10 pt-8">
            <Formik
              initialValues={{
                eventTitle: "",
                eventName: "",
                contractAddress: "",
                chain: "Starknet",
              }}
              onSubmit={(values, _) => handleSetValue(values as FormikValues)}
            >
              {(formik) => (
                <Form>
                  <h3 className="font-bold text-lg ">Create New Event</h3>
                  <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="" className="text-sm ml-1">
                      Event Title
                    </label>
                    <Field
                      type="text"
                      name="eventTitle"
                      id="eventTitle"
                      placeholder="Event Title"
                      className="input input-bordered w-full rounded-md focus-visible:ring-0 focus-visible:border-none text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="" className="text-sm ml-1">
                      Event Name (as per contract)
                    </label>
                    <Field
                      type="text"
                      name="eventName"
                      id="eventName"
                      placeholder="Event Name as per contract"
                      className="input input-bordered w-full rounded-md focus-visible:ring-0 focus-visible:border-none text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="" className="text-sm ml-1">
                      Contract Address
                    </label>
                    <Field
                      type="text"
                      name="contractAddress"
                      id="contractAddress"
                      placeholder="Contract Address (0x..)"
                      className="input input-bordered w-full rounded-md focus-visible:ring-0 focus-visible:border-none text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="" className="text-sm ml-1">
                      Chain
                    </label>
                    <select
                      className="select select-bordered w-full rounded-md focus-visible:ring-0 focus-visible:border-none"
                      name="chain"
                      id="chain"
                      onChange={(e) => {
                        formik.setFieldValue("chain", e.target.value);
                      }}
                    >
                      <option>Starknet</option>
                      <option>Ethereum Sepolia</option>
                    </select>
                  </div>
                  <button
                    className="btn bg-slate-900 hover:bg-slate-900 text-white rounded-md w-full mt-6"
                    type="submit"
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <div className="flex h-full w-full">
          <div className="w-[350px] border-r border-slate-200 bg-white h-full flex flex-col p-5 gap-5">
            <div className="mb-6">
              <p className="font-bold tracking-wide text-3xl pl-3 pt-2 font-Poppins">
                ChainNotify
              </p>
            </div>
            <div className=" rounded-xl p-3 border font-semibold flex gap-2 items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-1">
                <HomeIcon className="mr-2 h-4 w-4" />
                <span>Home</span>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 duration-200 ease-in-out" />
            </div>
            <div className=" rounded-xl p-3 bg-purple-600 text-white font-semibold flex gap-2 items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-1">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 duration-200 ease-in-out" />
            </div>
          </div>
          <div className="w-full">
            <div className="border-b border-slate-200 h-[70px] flex items-center justify-between px-7">
              <button
                className="btn btn-outline gap-1"
                onClick={() =>
                  document.getElementById("my_modal_2")!.showModal()
                }
              >
                <span className="">Add New Event</span>
              </button>
              {/* <button className="btn btn-outline gap-1">
                <span className="">0x87cd1...Fd283</span>
              </button> */}
              <DynamicWidget />

              {/* <CustomConnectButton /> */}
            </div>
            <div
              className="p-3"
              style={{
                maxHeight: "calc(100vh - 150px)",
              }}
            >
              <div
                className="overflow-x-auto border border-slate-200"
                style={{
                  maxHeight: "calc(100vh - 130px)",
                }}
              >
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Chain</th>
                      <th>Created At</th>
                      <th className="sr-only"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                      <tr key={index}>
                        <td className="h-24">
                          <div className="flex items-center gap-3">
                            {/* <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
                                  alt="Avatar Tailwind CSS Component"
                                />
                              </div>
                            </div> */}
                            <div>
                              <div className="font-bold">Transfer Event</div>
                              <div className="text-sm opacity-50">
                                0x87cd12be2cf76239294D97Ea4978Ee9cC19Fd283
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 border rounded-full w-fit p-1 px-2">
                            {index % 2 === 0 ? (
                              <>
                                <img
                                  src="https://cdn-images-1.medium.com/max/1200/1*sR6r6LFD2GQ6RT0mLOAuZQ.png"
                                  alt="starknet"
                                  className="h-5 w-5"
                                />
                                <span className="font-semibold">
                                  Starknet Sepolia
                                </span>
                              </>
                            ) : (
                              <>
                                <img
                                  src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png"
                                  alt="eth"
                                  className="h-5 w-5"
                                />
                                <span className="font-semibold">
                                  Ethereum Sepolia
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td>2023-07-12 10:42 AM</td>
                        <th>
                          <button
                            className="btn btn-outline btn-xs"
                            onClick={() => router.push(`/contractpage/efeefef`)}
                          >
                            <span className="">Open</span>
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </button>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
