"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosclient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Subscriber = { _id: string; email: string; createdAt: string };

export default function SettingsPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  useEffect(() => {
    axiosClient
      .get("/subscriber")
      .then((res) => setSubs(res.data.subscribers || []))
      .catch(() => setSubs([]));
  }, []);

  return (
    <div className="p-4 md:p-6 bg-card rounded-2xl border border-border space-y-4">
      <div>
        <h1 className="text-lg md:text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Subscribers</p>
      </div>

      <div className="text-sm text-muted-foreground">Total subscribers: {subs.length}</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subs.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.email}</TableCell>
              <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
