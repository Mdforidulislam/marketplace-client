import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
  Avatar,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { MdDeleteOutline } from "react-icons/md";
import { TiTick } from "react-icons/ti";


interface Person {
  name: string;
  email: string;
  status: string;
  avatar: string; 
}

const AllUsers: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("users.json");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchData();
  }, []); 
  const rowsPerPage = 10;


  const pages = Math.ceil(data.length / rowsPerPage);

  const loadingState: "loading" | "idle" =
    isLoading || !data.length ? "loading" : "idle";

  const statusColorMap: { [key: string]: "success" | "danger" } = {
    verified: "success",
    unverified: "danger",
  };

  return (
    <div className="md:min-w-[70rem] overflow-hidden py-12">
      <Table
        className="w-full"
        aria-label="Example table with client async pagination"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn className="font-bold" key="name">
            Name
          </TableColumn>
          <TableColumn className="font-bold" key="email">
            Email
          </TableColumn>
          <TableColumn className="font-bold" key="status">
            Status
          </TableColumn>
          <TableColumn className="font-bold" key="action">
            Action
          </TableColumn>
        </TableHeader>
        <TableBody
          items={data.slice((page - 1) * rowsPerPage, page * rowsPerPage)} 
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item: Person) => (
            <TableRow key={item?.name}>
              {(columnKey) => (
                <TableCell className="font-medium">
                  {columnKey === "name" ? (
                    <div className="flex items-center justify-start gap-4">
                      <Avatar isBordered color="default" src={item.avatar} />
                      <span className="ml-2">
                        {getKeyValue(item, columnKey)}
                      </span>
                    </div>
                  ) : columnKey === "status" ? (
                    <Chip
                      className="capitalize"
                      color={statusColorMap[item.status] || "default"}
                      size="sm"
                      variant="flat"
                    >
                      {item.status}
                    </Chip>
                  ) : columnKey === "action" ? (
                    <div className="flex gap-2">
                      <Tooltip color="danger" content="Delete user">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDeleteOutline />
                        </span>
                      </Tooltip>
                      <Tooltip color="success" content="Approve user">
                        <span className="text-lg text-success cursor-pointer active:opacity-50">
                          <TiTick />
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllUsers;
