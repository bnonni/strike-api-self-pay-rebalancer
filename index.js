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

const apiCall = async (path, method, json) => {
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
    let invoices = [],
        quotes = [];
    for (let i = total / multiple; i > 0; i--) {
        const response = await apiCall('/invoices', 'POST', {
            amount: { amount: multiple, currency: currency },
            description: memo,
        });
        const invoice = await response.json();
        invoices.push(invoice);
    }

    for (let invoice of invoices) {
        const response = await apiCall(
            `/invoices/${invoice.invoiceId}/quote`,
            'POST'
        );
        const quote = await response.json();
        quotes.push(quote.lnInvoice);
    }
    return quotes;
};

const payInvoices = async (total, multiple, currency, memo) => {
    let receipts = [];
    const hashes = await createInvoices(total, multiple, currency, memo);
    for (let hash of hashes) {
        const receipt = lnService.pay({ lnd, hash });
        receipts.push(receipt);
    }
    return receipts;
};

const initializeSelfPayRebalancer = async (total, multiple, currency, memo) => {
    return await payInvoices(total, multiple, currency, memo);
};

module.exports = { initializeSelfPayRebalancer }
