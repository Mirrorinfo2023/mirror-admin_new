"use client"
import React from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import AddLeadForm from "@/components/leads/AddLead";

function AddNewLead(props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');

    const handleSuccess = () => {
        router.push('/lead-management');
    };

    const handleCancel = () => {
        router.push('/lead-management');
    };

    return (
        <Layout>
            <AddLeadForm
                editId={editId}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </Layout>
    );
}

export default withAuth(AddNewLead);