import React, { useEffect, useState } from "react";
import { Account } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";

const getaccountbyaccountid = `${process.env.REACT_APP_API_URL}/Account/`;
const checkEmailExists = `${process.env.REACT_APP_API_URL}/Account/checkExistEmail/`;

export async function getAccountByAccountId(AccountId: string | number) {
  try {
    let account: Account = await axios.get(getaccountbyaccountid + AccountId).then((response) => response.data);
    return account;
  } catch (err) {
    console.log(err);
  }
}

export async function getCheckExistEmail(email: string): Promise<boolean> {
  try {
    let checkExistEmail = await axios.get(checkEmailExists + email);
    return checkExistEmail.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
