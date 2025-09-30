import React, { useState } from "react";
import { Table } from "../wind/Table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, updateUser, User } from "@/server/userActions";
import { Button } from "@/components/buttons/Button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import ConfirmRole from "./confirm-role-pop-up";
import { toast } from "sonner";
import { filterPeople } from "@/server/newFilterActions";
import { useDebounce } from "@/hooks/use-debounce";
import CreateUserDialog from "@/app/(root)/people/_components/add-user-form/create-user.dialog";

function AdminAccess({ searchTerm }: { searchTerm: string }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string | null>(null);
  // console.log(searchTerm);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: [
      "all-users",
      {
        searchQuery: debouncedSearchTerm,
      },
    ],
    queryFn: () =>
      filterPeople({
        searchQuery: debouncedSearchTerm,
      }),
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      return updateUser(updatedUser._id, updatedUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-users"],
        exact: false,
        refetchType: "all",
      });
      setShowModal(false);
      toast.success("Updated user permissions !");
    },
    onError: () => {
      toast.error("Failed to updated user permissions !");
    },
  });

  const handleRoleChange = (val: string, user: User) => {
    const isAdmin = user.role !== 1;

    // If changing from Admin to Employee and this is the only admin, prevent it
    if (val === "Employee" && isAdmin) {
      const adminCount = data?.users?.filter((u) => u.role !== 1).length || 0;

      if (adminCount === 1) {
        toast.error(
          "Role change failed. Add another admin before changing their role."
        );
        return;
      }
    }

    // No change — don't open modal
    if ((val === "Admin" && isAdmin) || (val === "Employee" && !isAdmin)) {
      return;
    }

    setSelectedUser(user);
    setNewRole(val);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!selectedUser || !newRole) return;

    const updatedUser = {
      _id: selectedUser?._id,
      role: newRole === "Admin" ? 2 : 1,
    };

    updateMutation.mutate(updatedUser);
  };

  return data?.users.length === 0 ? (
    <div className="flex flex-col gap-6 justify-center items-center py-8">
      <div className="flex  font-gilroySemiBold flex-col   justify-center items-center ">
        <img src="/media/no_data/people.svg" alt="No-People Logo" />
      </div>

      <CreateUserDialog>
        <Button variant="primary" className="w-fit">
          Add Member
        </Button>
      </CreateUserDialog>
    </div>
  ) : (
    <>
      <div className="h-full">
        <Table
          className="border h-[100vh] rounded-md"
          data={data?.users}
          isLoading={status === "pending"}
          selectedIds={[]}
          setSelectedIds={() => {}}
          columns={[
            {
              title: "Name",
              render: (record: User) => (
                <div className="text-sm">{record?.first_name}</div>
              ),
            },
            {
              title: "Designation",
              render: (record: User) => (
                <div className="text-sm">{record?.designation}</div>
              ),
            },
            {
              title: "Role",
              render: (record: User) => (
                <div className="text-xs">
                  <Select
                    onValueChange={(val) => handleRoleChange(val, record)}
                    value={record.role === 1 ? "Employee" : "Admin"}
                  >
                    <SelectTrigger
                      className={cn(
                        "font-gilroyMedium w-28 text-[13px] justify-between",
                        record.role !== 1 && "text-[#0D9B00]"
                      )}
                    >
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>

                    <SelectContent className="font-gilroyMedium md:text-sm">
                      <SelectItem value="Employee" className="md:text-sm">
                        Employee
                      </SelectItem>
                      <SelectItem value="Admin" className="text-sm ">
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ),
            },
          ]}
        />
      </div>

      {showModal && selectedUser && (
        <ConfirmRole
          onConfirm={handleConfirm}
          open={showModal}
          setOpen={setShowModal}
        />
      )}
    </>
  );
}

export default AdminAccess;
