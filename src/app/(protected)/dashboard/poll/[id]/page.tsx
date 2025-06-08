"use client";

import { notFound } from "next/navigation";

interface PollPageProps {
  params: {
    id: string;
  };
}

export default async function PollPage({ params }: PollPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return id;
}
