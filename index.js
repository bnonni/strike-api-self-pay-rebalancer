#!/usr/bin/env node
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config()
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

const createInvoices = async (t, m, d) => {
    let invoices = [];
    for (let i = t / m; i > 0; i--) {
        const response = await fetch(`${BASE_URL}/invoices`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify({
                amount: {
                    amount: m,
                    currency: 'USD',
                },
                description: d,
            }),
        });
        const invoice = await response.json();
        // console.log(invoice);
        invoices.push(invoice);
    }
    return invoices;
};

createInvoices('250', '50', 'rebalance').then(invoices => console.log(invoices));
