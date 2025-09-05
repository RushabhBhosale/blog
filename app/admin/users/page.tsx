"use client";

import { useEffect, useMemo, useState } from "react";
import axiosClient from "@/lib/axiosclient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type User = { _id: string; name?: string; email: string; role?: string; isActive?: boolean; createdAt: string };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/user");
      setUsers(res.data.users || []);
    } catch (e) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setRole = async (id: string, role: string) => {
    try {
      await axiosClient.put(`/user/${id}`, { role });
      setUsers((p) => p.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch {
      toast.error("Failed to update role");
    }
  };

  const setActive = async (id: string, isActive: boolean) => {
    try {
      await axiosClient.put(`/user/${id}`, { isActive });
      setUsers((p) => p.map((u) => (u._id === id ? { ...u, isActive } : u)));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const remove = async (id: string) => {
    try {
      await axiosClient.delete(`/user/${id}`);
      setUsers((p) => p.filter((u) => u._id !== id));
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const filtered = useMemo(
    () =>
      users.filter((u) => `${u.name || ""} ${u.email}`.toLowerCase().includes(q.toLowerCase())),
    [users, q]
  );

  return (
    <div className="p-4 md:p-6 space-y-4 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-lg md:text-2xl font-bold">Users</h1>
        <Input placeholder="Search name or email..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((u) => (
            <TableRow key={u._id}>
              <TableCell className="font-medium">{u.name || "—"}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Select value={u.role || "user"} onValueChange={(val) => setRole(u._id, val)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">user</SelectItem>
                    <SelectItem value="admin">admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant={u.isActive ? "outline" : "secondary"}
                  onClick={() => setActive(u._id, !u.isActive)}
                >
                  {u.isActive ? "Active" : "Inactive"}
                </Button>
              </TableCell>
              <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => remove(u._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
