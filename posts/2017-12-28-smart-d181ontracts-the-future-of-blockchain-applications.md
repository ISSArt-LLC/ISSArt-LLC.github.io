---
id: 2388
title: 'Smart Сontracts: the Future of Blockchain Applications'
date: '2017-12-28T17:22:24+08:00'
author: 'Evgeny Chemezov'
layout: post
image: /static/img/2017/12/shaking-hands-2965055_960_720.jpg
categories:
    - General
tags:
    - blockchain
    - 'blockchain technology'
    - cryptocurrency
    - 'smart contracts'
---

These days the topic of cryptocurrencies along with mentions of blockchain technology is featuring heavily in top news stories worldwide. It has become very popular to talk about Bitcoins and their possible future in the financial world. To learn more about cryptocurrencies, you can read this ultimate [guide](https://www.cryptocoinsociety.com/what-is-cryptocurrency) for beginners.

But for technical guys, all this news and popularity of the first cryptocurrency are an evidence of obvious applicability and successfulness of underlying technologies and the reason to search for other approaches where they can be used.

Smart contracts are probably the most powerful applications of blockchain technology actively evolving recently and deserving special attention of anyone who wants to dive into this new world of virtual things, becoming as real and significant as virtual money.

## Some Facts about Smart Contracts

The idea of smart contracts was first proposed by Nick Szabo in 1996. He described them as contracts represented by computer code which can be partially or fully self-executable separately and independently from participants to verify and enforce the performance of arrangements declared in the contract. These contracts should be:

- decentralized,
- publicly available,
- execution result should be trusted by all contract participants.

Similar to other examples of automatization, Smart contacts aim to replace traditional contracts by reducing the transaction cost and providing a more secure and trustworthy approach to arrangements performance.

To achieve all claimed advantages, a Smart contract can be implemented only in the assumption that all objects of the contract should exist in the same environment as the contract, so that the contract could have a direct and exclusive access to manage it. Usually it is the main problem to implement an environment suitable to these conditions. That's why smart contracts remained just a good idea for a long time.

## From Bitcoin to Smart Contracts

However, with the introduction of cryptocurrencies based on blockchain technology, the idea of smart contracts was raised again. Actually, operations with [Bitcoin](https://ru.bitcoinwiki.org/wiki/Bitcoin) are kind of smart contracts and Bitcoin's blockchain is a suitable environment where these smart contracts make sense.

Unfortunately, Bitcoin protocol implementing the main principles of smart contracts, was too limited to use it for writing more complex contracts than regular money operations. That's why in 2013 a co-founder of Bitcoin Magazine, Vitalik Buterin, suggested a new protocol based on the blockchain, more powerful and suitable to write any smart contracts. Two years later, the new platform [Ethereum](https://ethereum.org/) was launched.

Ethereum is the first blockchain based platform designed for smart contracts. It is an open-source public blockchain-based distributed computing platform where smart contracts can be stored and executed. Ethereum provides a virtual machine EVM (Ethereum Virtual Machine), which is part of the protocol and can be run anywhere and by anybody to execute a code written in a special language which is Turing-complete and allows describing any mathematically strict algorithm of contract. Ethereum also has its own cryptocurrency – Ether, which is required to execute any blockchain modifications. One of the main rules of Ethereum – no money, no execution. It makes Ether as demanded as Ethereum and smart contracts running in its environment. So, Ether can be treated as the first valuable entity in Ethereum environment which can be used as a contract object. Other objects of the contract can be introduced by contracts themselves or put into a blockchain as contract properties.

Even if it sounds strange, yes, the contract can generate its own asset, for example, own cryptocurrency. The value of this asset will be defined by users who will want to get it. So, the main problem for the owner of the contract is to “generate” this value, in other words, the owner of the contract should provide something valuable in exchange for the contract's asset/cryptocurrency. It may sound crazy, but have a look at the [Bitcoin quotation](https://charts.bitcoin.com/chart/price).

It is also not so easy to put something valuable to the blockchain. The problem is that the blockchain is a publicly available storage and anybody can read everything you put into it. So, to resolve this problem you should use cryptography and some tricky approaches how to put and take something secret to the public storage.

To explain this and other problems related to the nature of the blockchain, used as a storage, we should understand what the blockchain is and how it works.

## Nature of Blockchain

The blockchain is a kind of database with the following characteristic:

- it is decentralized. There is no command center or main node, all nodes are equal and the number of nodes or their location is not determined, they can be anywhere connected to the same network (Internet for public blockchains like Bitcoin or Ethereum).
- All nodes can read anything written to blockchain.
- All nodes can write new data into blockchain. Writing should follow a special protocol, defined for this blockchain. It is important to understand that data in Blockchain does not exist outside the protocol, or in other words, they are not treated as the blockchain's data by nodes. If one node breaks the protocol, the other nodes will ignore these changes and the changes will have no sense.
- The data written into the blockchain can't be modified or deleted. It is insured by the protocol using secure cryptographic hashes.
- The data are in the blockchain ONLY IF the node knows about these data and can verify that it is correctly signed by hashes based on all known data in the blockchain.
- All nodes communicate with the other nodes to exchange information about the current known state of the blockchain. If the node recognizes that its state differs from the state of another node, it resolves the conflict using special rules (part of the protocol). For example, in Bitcoin and Ethereum blockchains, the longest chain (contains more blocks) is always valid.
- The data cannot be deleted from the blockchain's block, but the block can be lost automatically if it is not a block of the current verified chain. To “trust” that data, it is written to the blockchain, it is required to wait until the block where the data is followed by N new blocks (where N is estimated based on the complexity of the block signature calculation).

## What about trustworthiness?

So, the Blockchain is decentralized and publicly available. But can we trust the results stored in it? At first glance – looks like no, but it is just a problem to solve. And of course, the solution is found. In the first and most popular application based on a blockchain, Bitcoin, there was used an approach known as Proof of Work (PoW) – to save the blockchain from replacement of long part of a chain with blocks of other data (as we know, it is the only way to edit the data in a blockchain), it should be difficult to calculate a new valid block, so, that calculation of N blocks by one user is probably a more difficult operation than the calculation of only one block. In Bitcoin the implementation of PoW uses the calculation of Merkle tree hash with an additional restriction for the result. The source of this hash is the content of the new block and the hash of the previous known block. But the calculation of the hash is not a very complex task itself and to make it complex PoW requires that the result should be less than some number value defined by the protocol. The value of the number is calculated based on the estimation of the total capacity of the network, so that in average only one new block should be added to the blockchain per 10 minutes regardless of the total network capacity.

Ethereum uses a similar implementation of PoW but with some modifications to make calculation more difficult for the hardware designed especially for hash calculation, making the network more protected from the concentration of the biggest capacity in one node, because if one node (or a set of joined nodes) controls > 50% of the total capacity, it can recalculate a long chain of blocks to rewrite the data.

## The Flip side of the Coin

PoW is the most reliable approach among the known ones to save the blockchain from rewrites. But it is also the most ineffective one for expended resources, like electricity. That's why many people see the future of the blockchain evolution connected with another approach, known as Proof of Stake (PoS). Its idea is to reduce the complexity of the block generation, but not all users have the same probability to add a new block, which makes a replacement of a long chain too complex for users who are ready to do it. Probability to add a new block can depend on the account balance (a user with more money will unlikely hack the system to bring down the money value) or be based on other parameters or randomized.

Ethereum is developing its own PoW algorithm too, but it is not being used yet.

## Ethereum – Blockchain Technologies Leader

So, why Ethereum is so popular as an environment for smart contracts and why is it better than its competitors?

1. It was the first which was designed especially for smart contracts. This is a brand-new area where there are no prepared solutions and most of the problems should be solved for the first time. All players in this area are pioneers and to be the first is important by itself.
2. Another reason is that they provide very good tools for anyone who wants to dive into this new world and start using all advantages of blockchain technologies without spending a lot of time on understanding and developing a blockchain from scratch. Ethereum is an environment which provides you with a ready-to-use protocol based on the running and actively used blockchain with an army of miners (users who build new blocks). You don't need to spend time and money to extend your blockchain network to make it well distributed and always available. You can get all of these immediately and almost free. All you need to pay for is computational resources of miners who will include your transactions into new blocks. In addition, you get a perfect high-level programming language to write your contracts, named Solidity, a good free toolkit to write, build and test your contracts, like IDE/Editor plugins, command line tools, web browser extensions and a lot of other useful tools making a process of contract development easy and pleasant

Writing a new blockchain based application using Ethereum compared to the development of the blockchain protocol from scratch is like choosing Java or C# for implementing an Enterprise web application instead of doing it using pure C or even C++, which is of course more powerful for low-level tasks, but requires more efforts to build a big system of well known blocks.

Ethereum.org provides good [documentation](http://www.ethdocs.org/en/latest/) for all parts of Ethereum. Reading it, you will get a know how to easy start with Ethereum, how to write simple smart contracts or build your own cryptocurrency in a few minutes. Ethereum is awesome, it is designed to allow you to build entire applications using smart contracts as containers of business logic and the blockchain as a storage of business' important data. It also provides bridges to other distributed systems, like Swarm, a decentralized and distributed storage, allowing you to keep the content of big files. All of these allows you to build a new generation of Web applications, known as Web3, independent of centralized datacenters, always available with clear and trustworthy business logic.

Of course, all of this will not be free, because all transactions and storage in Ethereum and other distributed systems cost Ether. You can buy Ether or earn mining transactions for others.

Don't worry that 1 Ether can become too expensive. All prices in Ethereum are in Gas units. Gas is the entity used in Ethereum to describe the cost of computational operations or using storage in the blockchain. All these costs are defined in the protocol and can be calculated for your contract.

A Gas can be bought for Ether on-demand in runtime. You can set your price per Gas for each transaction. Setting a bigger price for Gas, you make your transaction more attractive for miners.

If Ether becomes more expensive, you can set a lower price for Gas.

It is very important to understand that all operations same as each byte stored in the blockchain are very expensive compared to the alternatives outside the blockchain and only operations, critical for the advantages provided by the blockchain should be executed this way. Of course, you can test your contracts in a local blockchain, it is free, but being deployed to production, it will work only for money.

So, while designing your new application integrated with Ethereum, keep in mind what parts of operations require the blockchain and what can be put aside to reduce the cost.

Moreover, Ethereum Core Protocol is licensed under the GPL, and you can use it as the base for your own new blockchain, based on your own implementations of PoW or with additional security restrictions. Or you can run an internal blockchain available only inside your private community (of course it makes sense only if you completely trust all nodes of your private community). It's up to you.

Ethereum is probably the best way to start using the blockchain in your application to utilize advantages it gives you. More and more services provide tools to make it easier and faster, for example, to run a private blockchain for testing in the cloud in a few clicks. All you need is the revolutionary idea utilizing unique advantages of the blockchain. Implement it in terms of smart contracts and make it popular and join the lucky blockchain pioneers.

If you are interested in the topic of the smart contracts and would like to discuss it, we will be happy to see your comments or questions below!