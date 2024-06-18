import Image from "next/image";
import {
  ArrowRight,
  HomeIcon,
  MoreHorizontal,
  Plus,
  PlusCircle,
} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  return (
    <div className="h-screen w-full ">
      <div className="flex h-full w-full">
        <div className="w-[400px] border-r border-slate-200 bg-white h-full flex flex-col p-5 gap-5">
          <div className="mb-10">
            <p className="font-bold tracking-wide text-3xl pl-3 pt-5 font-Poppins">
              ChainNotify
            </p>
          </div>
          <div className=" rounded-xl p-3 bg-purple-600 text-white font-semibold flex gap-2 items-center">
            <HomeIcon className="mr-2 h-4 w-4" /> Home
          </div>
        </div>
        <div className="w-full">
          <div className="border-b border-slate-200 h-[70px] flex items-center justify-end px-7">
            <Button className="gap-1 focus-visible:ring-0" variant={"outline"}>
              <span className="">0x87cd1...Fd283</span>
            </Button>
          </div>
          <Card
            className="shadow-none flex-1 mx-3 mr-10 mt-10 overflow-y-auto"
            style={{
              maxHeight: "calc(100vh - 150px)",
            }}
          >
            <div className="flex">
              <CardHeader className="flex-1">
                <CardTitle className="text-3xl">Smart Contract</CardTitle>
                <CardDescription>Manage your smart contracts</CardDescription>
              </CardHeader>

              <div className="p-10">
                <Button
                  className="gap-1 focus-visible:ring-0"
                  variant={"outline"}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="">Add</span>
                </Button>
              </div>
            </div>
            <CardContent className="flex-1">
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <TableRow className="h-20">
                      <TableCell className="font-medium truncate max-w-[15rem]">
                        <p>ERC20 Transfer Contract</p>
                        <p className="font-light truncate">
                          0x87cd12be2cf76239294D97Ea4978Ee9cC19Fd283
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-700">Live</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-07-12 10:42 AM
                      </TableCell>
                      <TableCell className="" align="right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="sm"
                              variant="outline"
                            >
                              <span className="">Open</span>
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            {/* <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
