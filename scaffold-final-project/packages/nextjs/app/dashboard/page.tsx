/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import type {NextPage} from "next";
import {BugAntIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {Address} from "~~/components/scaffold-stark";
import {useAccount, useContractRead} from "@starknet-react/core";
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
import {useEffect, useMemo, useState} from "react";
import {CustomConnectButton} from "~~/components/scaffold-stark/CustomConnectButton";
import {useScaffoldReadContract} from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import {useScaffoldContract} from "~~/hooks/scaffold-stark/useScaffoldContract";
import {getAllContracts} from "~~/utils/scaffold-stark/contractsData";
import {
  ContractName,
  getFunctionsByStateMutability,
} from "~~/utils/scaffold-stark/contract";
import {useDeployedContractInfo} from "~~/hooks/scaffold-stark";
import {BlockNumber} from "starknet";
import {displayTxResult} from "../debug/_components/contract";
import {Abi} from "abi-wan-kanabi";
import axios from "axios";

const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];
// console.log(contractsData.YourContract2, "fucku");

const Dashboard: NextPage = () => {
  const {account} = useAccount();
  const router = useRouter();
  const {primaryWallet, user} = useDynamicContext();

  const {data: yourContract2} = useScaffoldContract({
    contractName: "YourContract2",
  });

  const {data: totalCounter} = useScaffoldReadContract({
    contractName: "YourContract2",
    functionName: "get_value",
    // refetchInterval: 10e3,
  });

  const {writeAsync: setValueFunctionName} = useScaffoldWriteContract({
    contractName: "YourContract2",
    functionName: "set_value",
    args: ["fidal", "fidal", "fidal", "fidal"],
  });

  console.log(Number(totalCounter), "totalCounter");

  // useEffect(() => {
  //   const fetchEventDetails = async () => {
  //     try {
  //       // Retrieve the event title for the event with ID 1

  //       const tokenId = await yourContract2?.get_chain(1);

  //       console.log("Event title:", tokenId);
  //     } catch (error) {
  //       console.error("Error fetching event title:", error);
  //     }
  //   };
  //   if (yourContract2) {
  //     fetchEventDetails();
  //   }
  // }, [yourContract2]);

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

      const res = await axios.post("http://localhost:3000/api/event", {
        eventName: values.eventName,
        eventTitle: values.eventTitle,
        userAddress: account?.address,
        contractAddress: values.contractAddress,
        email: user?.email || "jaydeep.dey03@gmail.com",
      });
      console.log("Transaction successful:", result);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  //   useEffect(() => {
  //     // route to / if user is not present or connectedAddress is not present
  //     if (!user || !connectedAddress) {
  //       router.push("/");
  //     }
  //   }, [user, connectedAddress, router]);

  const {isFetching, data, refetch} = useContractRead({
    address: contractsData.YourContract2.address,
    functionName: "get_chain",
    abi: contractsData.YourContract2.abi as any[],
    args: ["1"],
    enabled: false,
    blockIdentifier: "pending" as BlockNumber,
    // refetchInterval: 10e3,
  });

  console.log(data, "data");

  const functionsToDisplay = getFunctionsByStateMutability(
    (contractsData.YourContract2.abi || []) as Abi,
    "view"
  )
    .filter((fn) => {
      const isQueryableWithParams = fn.inputs.length > 0;
      return isQueryableWithParams;
    })
    .map((fn) => {
      return {
        fn,
      };
    });

  const [allValues, setAllValues] = useState<any[]>([]);

  function stringifyWithBigInt(obj: any) {
    return JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
  }

  function isObjectInArray(arr: any, obj: any) {
    const objStr = stringifyWithBigInt(obj);
    return arr.some((item: any) => stringifyWithBigInt(item) === objStr);
  }

  // Function to add unique object to an array
  function addUniqueObjectToArray(arr: any, obj: any) {
    if (!isObjectInArray(arr, obj)) {
      arr.push(obj);
    }
  }

  useEffect(() => {
    let values: any[] = [];
    async function getAllValues() {
      try {
        for (let i = 1; i < Number(totalCounter); i++) {
          const owner = await yourContract2?.get_Owner(BigInt(i));
          const contractAddresses = await yourContract2?.get_cAddress(
            BigInt(i)
          );
          const eventName = await yourContract2?.get_eventName(BigInt(i));
          const eventTitle = await yourContract2?.get_eventTitle(BigInt(i));
          const chain = await yourContract2?.get_chain(BigInt(i));

          const displayOwner = displayTxResult(
            owner,
            false,
            functionsToDisplay[0].fn.outputs
          );
          const displayContractAddresses = displayTxResult(
            contractAddresses,
            false,
            functionsToDisplay[1].fn.outputs
          );
          const displayEventName = displayTxResult(
            eventName,
            false,
            functionsToDisplay[2].fn.outputs
          );
          const displayEventTitle = displayTxResult(
            eventTitle,
            false,
            functionsToDisplay[3].fn.outputs
          );

          const displayChain = displayTxResult(
            chain,
            false,
            functionsToDisplay[4].fn.outputs
          );

          const res = await axios.get("http://localhost:3000/api/event", {
            params: {
              eventName: displayEventName,
              eventTitle: displayEventTitle,
              userAddress: displayOwner,
              contractAddress: displayContractAddresses,
            },
          });

          if (
            displayOwner != "" &&
            displayContractAddresses != "" &&
            displayEventName != "" &&
            displayEventTitle != "" &&
            displayChain != ""
          ) {
            addUniqueObjectToArray(values, {
              owner: displayOwner,
              contractAddresses: displayContractAddresses,
              eventName: displayEventName,
              eventTitle: displayEventTitle,
              chain: displayChain,
              toggleState: true,
            });
          }

          console.log(values, "fucku");
        }

        if (
          Number(totalCounter) &&
          allValues.length < Number(totalCounter) - 1
        ) {
          setAllValues(values);
        }
      } catch (err) {
        console.log(err, "err");
      }
    }

    if (yourContract2 && Number(totalCounter)) {
      getAllValues();
    }
  }, [functionsToDisplay, yourContract2]);

  if (allValues.length > 0) {
    console.log(allValues, "allValues");
  }

  const [isChecked, setIsChecked] = useState(false);

  // Step 3: Handle the change event
  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };

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
              // onSubmit={(values, _) => {}}
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
          <div className="w-[350px] border-r border-slate-200 bg-white text-black h-full flex flex-col p-5 gap-5">
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
                className="btn btn-outline gap-1 text-black"
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

              <CustomConnectButton />
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
                  <thead className="text-black">
                    <tr>
                      <th>Event Name</th>
                      <th>Chain</th>
                      <th className="">Toggle Notification</th>
                      <th className="sr-only"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {allValues.length > 0 &&
                      allValues.map((item, index) => (
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
                              <div className="flex justify-start items-start gap-2 w-full flex-col">
                                {/* <div className="skeleton h-4 w-1/3 rounded" />
                              <div className="skeleton h-4 w-full rounded" /> */}
                                <div className="font-bold">
                                  {item.eventTitle}
                                </div>
                                <div className="text-sm opacity-50">
                                  {item.contractAddresses}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2 border rounded-full w-fit p-1 px-2">
                              <img
                                src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png"
                                alt="eth"
                                className="h-5 w-5"
                              />
                              <span className="font-semibold">
                                {item.chain}
                              </span>
                            </div>
                          </td>
                          <td className="m-auto">
                            <div className="form-control">
                              <label className="label cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="toggle"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      axios
                                        .post(
                                          "http://localhost:3000/api/event",
                                          {
                                            eventName: item.eventName,
                                            eventTitle: item.eventTitle,
                                            userAddress: item.owner,
                                            contractAddress:
                                              item.contractAddresses,
                                            email:
                                              user?.email ||
                                              "jaydeep.dey03@gmail.com",
                                          }
                                        )
                                        .then((res) => {
                                          console.log(res, "res");
                                        })
                                        .catch((err) => {
                                          console.log(err, "err");
                                        });
                                    } else {
                                      axios
                                        .delete(
                                          "http://localhost:3000/api/event",
                                          {
                                            params: {
                                              eventName: item.eventName,
                                              eventTitle: item.eventTitle,
                                              userAddress: item.owner,
                                              contractAddress:
                                                item.contractAddresses,
                                            },
                                          }
                                        )
                                        .then((res) => {
                                          console.log(res, "res");
                                        })
                                        .catch((err) => {
                                          console.log(err, "err");
                                        });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </td>
                          <th>
                            <button
                              className="btn btn-outline btn-xs text-black"
                              onClick={() =>
                                router.push(
                                  `/contractpage/${item.contractAddresses}`
                                )
                              }
                            >
                              <span className="">Open</span>
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </button>
                          </th>
                        </tr>
                      ))}

                    {allValues.length === 0 &&
                      Number(totalCounter) > 0 &&
                      Array.from({length: Number(totalCounter)}).map(
                        (item, index) => (
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
                                <div className="flex justify-start items-start gap-2 w-full flex-col">
                                  {/* <div className="skeleton h-4 w-1/3 rounded" />
                              <div className="skeleton h-4 w-full rounded" /> */}
                                  <div className="font-bold">
                                    <div className="skeleton h-4 w-28" />
                                  </div>
                                  <div className="text-sm opacity-50">
                                    <div className="skeleton h-4 w-44"></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2 border rounded-full w-fit p-1 px-2">
                                <img
                                  src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png"
                                  alt="eth"
                                  className="h-5 w-5"
                                />
                                <span className="font-semibold">
                                  <div className="skeleton h-4 w-24"></div>
                                </span>
                              </div>
                            </td>
                            <th>
                              <button
                                className="btn btn-outline btn-xs text-black"
                                onClick={() =>
                                  router.push(
                                    `/contractpage/${"item.contractAddresses"}`
                                  )
                                }
                              >
                                <span className="">Open</span>
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </button>
                            </th>
                          </tr>
                        )
                      )}
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
function setValueFunctionName(arg0: {args: any[]}) {
  throw new Error("Function not implemented.");
}
