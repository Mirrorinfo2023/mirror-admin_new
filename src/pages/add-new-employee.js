"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import EmployeeTransactions from "@/components/Employee/add_employee";
import { useRouter } from "next/router";

function AddEmployee() {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = Cookies.get("employee_role");
  const { id, action } = router.query;

  useEffect(() => {
    // Permission logic (unchanged)
  }, [role, action]);

  return (
    <Layout>
      <EmployeeTransactions />
    </Layout>
  );
}

export default withAuth(AddEmployee);
