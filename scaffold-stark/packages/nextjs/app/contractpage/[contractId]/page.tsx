/* eslint-disable @next/next/no-img-element */
"use client";

import {ArrowLeft, Pencil, Trash} from "lucide-react";
import {useRouter} from "next/navigation";

export default function ContractPage({params}: {params: {contractId: string}}) {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="h-[80px] w-full bg-slate-700 flex items-center justify-between px-10 text-white">
        <div className="">
          <div
            className="flex items-center gap-6 cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-8 w-8 p-1 border rounded-full text-white" />
          </div>
        </div>

        <div>
          <p>{params.contractId}</p>
        </div>
        <div>
          <button className="btn btn-outline gap-1 bg-white text-black">
            <span className="">0x87cd1...Fd283</span>
          </button>
        </div>
      </div>
      <div className="h-full w-full flex gap-2 justify-center items-center px-10 pt-10">
        <div
          className="border-2 border-slate-200 h-full rounded-xl w-full flex-1 px-5 pt-5"
          style={{
            height: "calc(100vh - 70px)",
          }}
        >
          <div>
            <label htmlFor="eventsSelect" className="">
              <p className="font-semibold ml-1">Events from Smart Contracts</p>
            </label>
            <select
              className="select select-bordered w-full rounded-md focus-visible:ring-0 focus-visible:border-none"
              id="eventsSelect"
            >
              <option>Transfer</option>
              <option>AddEvent</option>
            </select>
          </div>
        </div>
        <div
          className="border-2 rounded-xl"
          style={{
            width: "calc(100% - 800px)",
            height: "calc(100vh - 70px)",
          }}
        >
          <div className="h-[80px] w-full border-b rounded-t-xl flex items-center px-7">
            <p className="font-semibold text-2xl">All Notifications</p>
          </div>
          <div
            className="w-full overflow-y-auto rounded-b-xl pb-5 "
            style={{
              height: "calc(100vh - 175px)",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
              <div className="card bg-base-100 border mx-5 mt-5" key={index}>
                <div className="card-body">
                  <h2 className="card-title">Event</h2>
                  <div className="flex justify-between h-14">
                    {/* add from and to duration */}
                    <div>
                      <span className="font-semibold">From: </span>
                      {/* date and time span element */}
                      <span className="text-sm">12th August, 2021</span>
                    </div>
                    <div>
                      <span className="font-semibold">To: </span>
                      <span className="text-sm">13th August, 2021</span>
                    </div>
                  </div>
                  <div className="card-actions justify-between flex items-center">
                    <div className="justify-start flex gap-2 items-center">
                      <input
                        type="checkbox"
                        className="toggle focus-visible:ring-0"
                      />
                      <span className="text-sm">Notification Active</span>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full">
                        <Pencil className="h-5 w-5" />
                      </div>
                      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full group">
                        <Trash className="h-5 w-5 group-hover:text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-10">
        <div className="w-full h-[500px] border-2 rounded-xl">hello</div>
      </div>
    </div>
  );
}
