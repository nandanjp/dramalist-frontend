"use client";

import { useParams, redirect } from "next/navigation";

export default function ShowDetailRedirect() {
    const { id } = useParams<{ id: string }>();
    redirect(`/catalog/${id}`);
}
