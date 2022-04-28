# Strike Wallet Self-Pay Rebalancer
## The Summary
The Self-Pay Rebalancer will plug into common LN OS distributions (or can be cloned and built), and 
it will allow lightning node operators to easily rebalance a channel by paying invoices from their node
to a wallet they also owns. Specifically, the fist iteration will leverage Strike's API.

## The Details
### Why?
Imagine a scenario where you have N channels and N-1 of them are perfectly rebalanced.
How do you rebalance the Nth channel without unbalancing the other channels? I'm sure you're thinking of
a number of different ways to do this such as loop, bos, boltz, sub-swaps, etc. However, having used most
of the common ways, I've been unsatisfied with their results. High fees, low reliability, out-of-band comms, 
counter-party trust. What about an automated self-paying mechanism that you control end-to-end?

### How?
Using this tool, you can input your Strike API key, set the total amount you need to reblanace (in USD), 
the increments of each invoice (USD) to pay and the first outbound channel to pay the invoice.
From here, the plugin will use your Strike API to generate equal numbers of invoices, grab the lnhash,
and pay them using the lncli.

### So What?
This app is nothing fancy. It's not meant to be. It is a very basic way to automate the process of paying
your Strike wallet from your lightning node in small enough parts / amounts to rebalance your channel.

**Contact me with questions / comments**
- [Telegram](https://t.me/BitcoinBryan)
- [Twitter](https://twitter.com/BryanNonni)

**Want a feature?**
1. Fork the repo
2. Create a `feature/new-feature-name` branch
3. Build it!
4. Submit a PR!
