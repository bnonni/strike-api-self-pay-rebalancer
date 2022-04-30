#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const TLS_CERT = process.env.TLS_CERT;
const ADMIN_MACAROON = process.env.ADMIN_MACAROON;

import fetch from 'node-fetch';
import lnService from 'ln-service';

const { lnd } = lnService.authenticatedLndGrpc({
    cert: TLS_CERT,
    macaroon: ADMIN_MACAROON,
    socket: '127.0.0.1:10009',
  });
  

const api_call = async (path, method, json) => {
    return await fetch(BASE_URL + path, {
        method: method,
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(json),
    });
};

const createInvoices = async (total, multiple, currency, memo) => {
    let invoices = [];  
    for (let i = total / multiple; i > 0; i--) {
        const response = await api_call('/invoices', 'POST', {
            amount: { amount: multiple, currency: currency },
            description: memo,
        });
        const invoice = await response.json();
        invoices.push(invoice);
    }

    for (let invoice of invoices) {
        const response = await api_call(`/invoices/${invoice.invoiceId}/quote`, 'POST');
        const quote = await response.json()
        console.log(quote.lnInvoice)
    }
};

const invoices = createInvoices('1', '1', 'USD', 'rebalance');
