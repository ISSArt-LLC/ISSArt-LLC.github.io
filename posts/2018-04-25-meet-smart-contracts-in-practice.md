---
id: 2615
title: 'Meet Smart Contracts in Practice'
date: '2018-04-25T18:15:40+08:00'
author: 'Denis Yakovlev'
layout: post
image: /static/img/2018/04/hands-2088954_1920.jpg
categories:
    - General
tags:
    - Ethereum
    - Java
    - smart-contract
    - Solidity
---

<span style="font-weight: 400;">If you know what a smart contract is, but you don’t know how to start working with it – you’re in the right place. We will start with creating a contract in a sandbox, then move to the Ethereum test network, next we will create our own node and connect to it from Java code. If you aren’t familiar with the Ethereum or smart contracts, you can read </span>[<span style="font-weight: 400;">this article</span>](https://www.issart.com/blog/smart-%D1%81ontracts-the-future-of-blockchain-applications/)<span style="font-weight: 400;"> first.</span>

<span style="font-weight: 400;">Solidity is the most common language to write contracts in Ethereum. In this article we won’t dive into language constructions, but will just show you the starting point. You can read about Solidity syntax in the </span>[<span style="font-weight: 400;">official documentation.</span>](http://solidity.readthedocs.io/en/latest/index.html)

### <span style="font-weight: 400;">Create a contract in Remix environment</span>

<span style="font-weight: 400;">We will start with creating a very simple contract from scratch in the sandbox, provided by [Remix](http://remix.ethereum.org)</span><span style="font-weight: 400;"> – Solidity IDE, that can run contracts inside a browser without any external connections. This is a good place to practice.</span>

<span style="font-weight: 400;">[![](/static/img/2018/04/Screenshot-from-2018-04-13-11-44-55-300x124.png)](/static/img/2018/04/Screenshot-from-2018-04-13-11-44-55.png)</span>

<span style="font-weight: 400;">Let’s create a new contract by clicking on Plus button in the upper left corner. We will name it ‘forest.sol’. This is a simple contract that allows users to sponsor tree planting, so let’s name it ‘Forest’. The author of the contract sets the price of planting one tree. When a user sends Ether to this contract, we will increase the number of trees that this user sponsored. The author can get Ether that was sent by sponsors. Also there is an opportunity to see the contribution of each user. </span>

```
<span style="font-weight: 400;">pragma solidity ^0.4.21;</span>
<span style="font-weight: 400;">contract Forest {    </span>
<span style="font-weight: 400;">    uint256 public treeCost;    </span>
<span style="font-weight: 400;">    mapping (address => uint256) sponsorCountributions;    </span>
<span style="font-weight: 400;">    address[] sponsors;    </span>
<span style="font-weight: 400;">    address owner;</span><span style="font-weight: 400;">    </span>

<span style="font-weight: 400;">    // How much it will cost to grow a tree.</span>
<span style="font-weight: 400;">    // Cost in wei. 1 Ether = 10 ^ 18 wei</span>
<span style="font-weight: 400;">    function Forest(uint256 _treeCost) public {</span>
<span style="font-weight: 400;">        treeCost = _treeCost;</span>
<span style="font-weight: 400;">        owner = msg.sender;</span>
<span style="font-weight: 400;">    }</span><span style="font-weight: 400;">    </span>

<span style="font-weight: 400;">    // Add a tree. Check that sender sent ether in required amount</span>
<span style="font-weight: 400;">    // If all correct we increment a counter to sender of a payment</span>
<span style="font-weight: 400;">    function addTree() payable public {</span>
<span style="font-weight: 400;">        require(msg.value == treeCost);</span>
<span style="font-weight: 400;">        if (sponsorCountributions[msg.sender] == 0) {</span>
<span style="font-weight: 400;">            sponsors.push(msg.sender);</span>
<span style="font-weight: 400;">        }</span>
<span style="font-weight: 400;">        sponsorCountributions[msg.sender]++;</span>
<span style="font-weight: 400;">    }</span><span style="font-weight: 400;">    </span>

<span style="font-weight: 400;">    // Get sponsor contribution in percentage of all contributions</span>
<span style="font-weight: 400;">    function getSponsorContribution(address sponsor) view public returns (uint8) {</span>
<span style="font-weight: 400;">        uint256 totalTrees = 0;</span>
<span style="font-weight: 400;">        for (uint256 i = 0; i < sponsors.length; i++) {</span>
<span style="font-weight: 400;">            totalTrees += sponsorCountributions[sponsors[i]];</span>
<span style="font-weight: 400;">        }</span>
<span style="font-weight: 400;">        if (totalTrees == 0) {</span>
<span style="font-weight: 400;">            return 0;</span>
<span style="font-weight: 400;">        }</span>
<span style="font-weight: 400;">        return (uint8) (100 * sponsorCountributions[sponsor] / totalTrees);</span>
<span style="font-weight: 400;">    }</span><span style="font-weight: 400;">    </span>

<span style="font-weight: 400;">    // Get ether from contract by its owner. amount in wei</span>
<span style="font-weight: 400;">    function getEther(uint256 amount) public {</span>
<span style="font-weight: 400;">        require(msg.sender == owner);</span>
<span style="font-weight: 400;">        require(address(this).balance >= amount);</span>
<span style="font-weight: 400;">        msg.sender.transfer(amount);</span>
<span style="font-weight: 400;">    }</span>
<span style="font-weight: 400;">}
</span>
```

<span style="font-weight: 400;">This contract is only an example, it checks the compiler version and creates a simple contract. This contract has ***4 functions***:</span>

1. <span style="font-weight: 400;">Forest – constructor that initiates contract and sets cost for one tree. The cost is measured in weis – a minimal coin in Ethereum, one Ether = 10</span><span style="font-weight: 400;">18</span><span style="font-weight: 400;"> weis.</span>
2. <span style="font-weight: 400;">addTree – pay for a new tree. The function is marked as payable, so a user has to send Ether from his wallet when he calls such function. We are checking the amount of Еther that user sent and if it equals the cost of one tree, we add the user as a sponsor and count his contribution.</span>
3. <span style="font-weight: 400;">getSponsorContribution – shows a user’s contribution to all the forest. Function is marked as view, so its execution will not produce a new transaction and will just be calculated on Ethereum node for free.</span>
4. <span style="font-weight: 400;">getEther – function that allows contract’s owner to get Ether from contract.</span>

<span style="font-weight: 400;">These functions show how to send Ether to contact and vice versa, change contracts state and perform read-only functions.</span>

<span style="font-weight: 400;">Before running a contract in Remix we should compile it – in the left toolbar select “compile” tab and click on the button “Start to compile”. Next step is a contract deployment. To deploy contract, switch to the tab “Run”, fill input field “\_treeCost” below the contract name and click on “Create” button.</span>

[![](/static/img/2018/04/contract_run_params-300x221.png)](/static/img/2018/04/contract_run_params.png)

<span style="font-weight: 400;">After it you will see a created contract block.</span>

<span style="font-weight: 400;">Now you can execute methods in this contract. In Remix there are 5 wallets for running in local environment, you can switch between them by selecting from “Account” drop-down list.</span>

<span style="font-weight: 400;">When you call method addTree, you should pass some Ether, to do so write this value in the text input “Value” near “Account”. When you call the method getSponsorContribution, you should pass the address as string – write it in double quotes. You can get the account address by clicking on the icon left to the selected “Account” value.</span>

### <span style="font-weight: 400;">Try communicating between contracts</span>

<span style="font-weight: 400;">Even if one contract is fully viable, there are many cases, when you need to get information from another contract (in Ethereum that type of contracts is called Oracles), or call other contracts to change their state. In this article we will dwell on reading information from another contract. </span>

<span style="font-weight: 400;">Every contract that has been deployed to Ethereum has an address, like any user’s wallet. So to call another contract we have to know the address of the contract and its interface (what methods the contract has and their parameters). In Remix you can copy contract’s address by clicking on the icon near the deployed contract’s name.</span>

<span style="font-weight: 400;">Let’s create a new contract “checker.sol” with this code:</span>

```
<span style="font-weight: 400;">pragma solidity ^0.4.21;</span>
<span style="font-weight: 400;">import "browser/forest.sol";
</span>
<span style="font-weight: 400;">contract SponsorChecker {</span>
<span style="font-weight: 400;">    function isForestSponsor(address sponsor, address forestContractAddress) public view returns (bool) {</span>
<span style="font-weight: 400;">        Forest forestContract = Forest(forestContractAddress);</span>
<span style="font-weight: 400;">        uint8 percentage = forestContract.getSponsorContribution(sponsor);</span>
<span style="font-weight: 400;">        return percentage > 0;</span>
<span style="font-weight: 400;">    }</span>
<span style="font-weight: 400;">}</span>
```

<span style="font-weight: 400;">An important thing here is an import statement: we need it to import another contract, that we want to call.</span>

<span style="font-weight: 400;">This contract contains only one function isForestSponsor, which takes 2 arguments – sponsor’s address and Forest contract’s deployed address. To be able to make calls to another contract we need to create an instance of this contract and provide deployed contract’s address. Next we call functions of that contract like any other objects.</span>

<span style="font-weight: 400;">To pass 2 parameters to a function you should wrap them in square brackets, like JSON array.</span>

### <span style="font-weight: 400;">Install MetaMask and get test Ether</span>

<span style="font-weight: 400;">Any transaction in real Ethereum network requires a bit of Ether, the cryptocurrency of Ethereum. Even in the most used test network Ropsten you should have some Ether, but because it is a test network, you can get it for free. One of the simplest ways is to install MetaMask and create there a new account.</span>

<span style="font-weight: 400;">MetaMask can be installed as a browser plugin or you can use their own browser. We will install it as a plugin to Chrome. Go to MetaMask </span>[<span style="font-weight: 400;">website</span>](https://metamask.io/)<span style="font-weight: 400;"> and install plugin. Next you should click on the fox icon in browser plugins panel and finish installation. By default MetaMask uses main network to execute transaction, but we just want to check how it works, so change network to Ropsten by clicking on “Main network” text in the upper left corner of the plugin and choose “Ropsten test network”. Now we have an Ethereum wallet, but it’s empty, so let’s get some coins. Click on “Buy” button and select “ROPSTEN TEST FAUCET”. On the page that opened just click “request 1 Ether from faucet” and wait a minute and that’s all, you have one Ether in your wallet. You can add as much Ether as you need.</span>

### <span style="font-weight: 400;">Install and launch our Ethereum node</span>

<span style="font-weight: 400;">At the previous step we successfully connected to test network, but we used MetaMask as a provider for that. If we want to communicate with contracts and perform transactions, it is better to have an own Ethereum node.</span>

<span style="font-weight: 400;">To do this, we need to install one of Ethereum clients. We will use the most common client – Geth. Go to </span>[<span style="font-weight: 400;">website</span>](https://geth.ethereum.org/downloads/)<span style="font-weight: 400;"> and choose your operating system. In this article we are using Ubuntu 16.04, we have installed it from the package manager:</span>

```
<span style="font-weight: 400;">sudo add-apt-repository -y ppa:ethereum/ethereum</span>
<span style="font-weight: 400;">sudo apt-get update</span>
<span style="font-weight: 400;">sudo apt-get install ethereum</span>
```

<span style="font-weight: 400;">After installing Geth we can run it. By default Geth connects to the main network and without RPC. So run it with these arguments:</span>

```
<span style="font-weight: 400;">geth --rpcapi personal,db,eth,net,web3 --rpc --testnet --fast</span>
```

<span style="font-weight: 400;">Enabled RPC (Remote process call) interface will listen to incoming requests by default on localhost and port 8545. After start Geth will connect to other nodes and download all existing blocks to the local machine. It will take a significant amount of time because the test network occupies 14Gb. After downloading all blocks the node is ready to perform transactions and synchronize them with other nodes.</span>

### <span style="font-weight: 400;">Connecting to Ethereum node from Java application</span>

<span style="font-weight: 400;">Now we have 2 contracts and a working Ethereum node. And we want to communicate with Ethereum from usual Java application. To make so, we will use library </span>[<span style="font-weight: 400;">web3j</span>](https://github.com/web3j/web3j)<span style="font-weight: 400;">. You can get it from </span>[<span style="font-weight: 400;">maven repository</span>](https://mvnrepository.com/artifact/org.web3j/core/3.3.1)<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">To start working with Ethereum node, we will create a web3j object with default parameters:</span>

```
<span style="font-weight: 400;">Web3j web3 = Web3j.build(new HttpService());</span>
```

<span style="font-weight: 400;">The first thing that we can do with it is to check connection by getting the node version:</span>

```
<span style="font-weight: 400;">Web3ClientVersion web3ClientVersion = web3.web3ClientVersion().send();</span>
<span style="font-weight: 400;">String clientVersion = web3ClientVersion.getWeb3ClientVersion();</span>
```

<span style="font-weight: 400;">This will make a synchronous request, by changing send() to sendAsync() or observable() you can perform async requests.</span>

<span style="font-weight: 400;">As a result you should get clientVersion like this: </span>

```
<span style="font-weight: 400;">Geth/v1.8.2-stable-b8b9f7f4/linux-amd64/go1.9.4</span>
```

<span style="font-weight: 400;">Next step is to read some useful data from Ethereum. So let’s check the balance of our wallet, that we created in MetaMask. To get the balance you need to know its address and you can get it from MetaMask plugin by copying it to the clipboard.</span>

[![](/static/img/2018/04/get-wallet-address-277x300.png)](/static/img/2018/04/get-wallet-address.png)

```
<span style="font-weight: 400;">Request<?, EthGetBalance> getBalanceRequest = web3.ethGetBalance(</span><b>"0x5E2966E536414867Ff9D8804718000229960d15F"</b><span style="font-weight: 400;">,</span><span style="font-weight: 400;"> DefaultBlockParameterName.</span><b><i>LATEST</i></b><span style="font-weight: 400;">);</span>
<span style="font-weight: 400;">EthGetBalance ethGetBalance = getBalanceRequest</span><span style="font-weight: 400;">.send();</span>
<span style="font-weight: 400;">BigInteger balance = ethGetBalance.getBalance();</span>
```

<span style="font-weight: 400;">Both version and account balance are read-only operations, that don’t produce new transactions to the Ethereum network. To perform operations (create contracts or call contracts functions) you should create and sign a transaction. To sign the transaction you need the account’s private key, you can get it near the accounts address in MetaMask plugin.</span>

<span style="font-weight: 400;">To perform operations with contract you can generate wrappers for it. You can add another dependency to your java project from maven repository: </span>[<span style="font-weight: 400;">web3j codegen</span>](https://mvnrepository.com/artifact/org.web3j/codegen/3.3.1)<span style="font-weight: 400;">. To make wrappers we need to have 2 files: compiled code and application binary interface (abi). You can install solidity compiler to your own computer from </span>[<span style="font-weight: 400;">solidity site</span>](http://solidity.readthedocs.io/en/latest/installing-solidity.html)<span style="font-weight: 400;">. For Ubuntu 16.04 you can install a compiler from package manager:</span>

```
<span style="font-weight: 400;">sudo add</span><b>-</b><span style="font-weight: 400;">apt</span><b>-</b><span style="font-weight: 400;">repository ppa</span><b>:</b><span style="font-weight: 400;">ethereum</span><b>/</b><span style="font-weight: 400;">ethereum</span>
<span style="font-weight: 400;">sudo apt</span><b>-</b><span style="font-weight: 400;">get update</span>
<span style="font-weight: 400;">sudo apt</span><b>-</b><span style="font-weight: 400;">get install solc</span>
```

<span style="font-weight: 400;">Save forest.sol from Remix to your filesystem and then run command:</span>

```
<span style="font-weight: 400;">solc forest.sol --bin --abi --optimize -o src/main/solidity/resources</span>
```

<span style="font-weight: 400;">It will generate in src/main/solidity/resources 2 files: bin and abi.</span>

<span style="font-weight: 400;">To generate wrappers you can run this code:</span>

```
<span style="font-weight: 400;">SolidityFunctionWrapperGenerator.</span><i><span style="font-weight: 400;">main</span></i><span style="font-weight: 400;">(Arrays.</span><i><span style="font-weight: 400;">asList</span></i><span style="font-weight: 400;">(</span>
<span style="font-weight: 400;">   </span><b>"src/main/solidity/resources/forest.bin"</b><span style="font-weight: 400;">, </span><i><span style="font-weight: 400;">// binary file location</span></i>
<i><span style="font-weight: 400;">   </span></i><b>"src/main/solidity/resources/forest.abi"</b><span style="font-weight: 400;">, </span><i><span style="font-weight: 400;">// abi file location</span></i>
<i><span style="font-weight: 400;">   </span></i><b>"-o"</b><span style="font-weight: 400;">, </span><b>"src/main/java"</b><span style="font-weight: 400;">, </span><i><span style="font-weight: 400;">// place to store generated wrapper</span></i>
<i><span style="font-weight: 400;">   </span></i><b>"-p"</b><span style="font-weight: 400;">, </span><b>"com.issart.blog.ethereum.wrappers"</b><span style="font-weight: 400;">) </span><i><span style="font-weight: 400;">// package name for generated class</span></i>
<i><span style="font-weight: 400;">   </span></i><span style="font-weight: 400;">.toArray(</span><b>new </b><span style="font-weight: 400;">String[]{}));</span>
```

<span style="font-weight: 400;">This will generate class Forest for your contract, so now we can deploy a new contract to the test Ethereum network. To do so we need an account, which will be the sender of transactions. We will create credentials object by providing accounts private key:</span>

```
<span style="font-weight: 400;">Credentials credentials = Credentials.</span><i><span style="font-weight: 400;">create</span></i><span style="font-weight: 400;">(</span><b>"7777744a213b2c35997c29b481ff091c54a18aed6d688d23f3662856cd5d5bfe"</b><span style="font-weight: 400;">);</span>
```

<span style="font-weight: 400;">To deploy a new contract you can run this code:</span>

```
<span style="font-weight: 400;">Forest forest = Forest.</span><i><span style="font-weight: 400;">deploy</span></i><span style="font-weight: 400;">(</span>
<span style="font-weight: 400;">   web3, </span><i><span style="font-weight: 400;">// configuration object</span></i>
<i><span style="font-weight: 400;">   </span></i><span style="font-weight: 400;">credentials, </span><i><span style="font-weight: 400;">// account credentials</span></i>
<i><span style="font-weight: 400;">   </span></i><b>new </b><span style="font-weight: 400;">BigInteger(</span><b>"30000000000"</b><span style="font-weight: 400;">), </span><i><span style="font-weight: 400;">// gas price</span></i>
<i><span style="font-weight: 400;">   </span></i><b>new </b><span style="font-weight: 400;">BigInteger(</span><b>"2000000"</b><span style="font-weight: 400;">), </span><i><span style="font-weight: 400;">// gas limit</span></i>
<i><span style="font-weight: 400;">   </span></i><b>new </b><span style="font-weight: 400;">BigInteger(</span><b>"2000"</b><span style="font-weight: 400;">)) </span><i><span style="font-weight: 400;">// tree cost - parameter of our contract</span></i>
<i><span style="font-weight: 400;">   </span></i><span style="font-weight: 400;">.send();</span>
<span style="font-weight: 400;">String contractAddress = forest.getContractAddress();</span>
```

<span style="font-weight: 400;">Gas price is set to a big amount because we use test network and Ether here is free. If you set it to a small amount, it could take more time to wait until our transaction is added to blockchain.</span>

<span style="font-weight: 400;">We can set any gas limit above estimated amount (you can see gas estimations in Remix contract details).</span>

<span style="font-weight: 400;">Tree cost is sent as a parameter to contracts constructor.</span>

<span style="font-weight: 400;">It takes some time to add a contract to blockchain. After completion we will get a contract object and have to save its address. So next time we can load this contract like this:</span>

```
<i><span style="font-weight: 400;">Forest forest = Forest.load(</span></i>
<i><span style="font-weight: 400;">   </span></i><b><i>"0x23948a7057929b5e9036a7faf0ceeb6499c2ddff"</i></b><i><span style="font-weight: 400;">, // contract address</span></i>
<i><span style="font-weight: 400;">   web3,</span></i>
<i><span style="font-weight: 400;">   credentials,</span></i>
<i><span style="font-weight: 400;">   </span></i><b><i>new </i></b><i><span style="font-weight: 400;">BigInteger(</span></i><b><i>"</i></b><b>30000000000</b><b><i>"</i></b><i><span style="font-weight: 400;">), // gas price</span></i>
<i><span style="font-weight: 400;">   </span></i><b><i>new </i></b><i><span style="font-weight: 400;">BigInteger(</span></i><b><i>"</i></b><b>2000000</b><b><i>"</i></b><i><span style="font-weight: 400;">)); // gas limit</span></i>
```

<span style="font-weight: 400;">Now we can perform operations on this contract. Let’s make our contribution to planting trees (change the address to your account address):</span>

```
<span style="font-weight: 400;">forest.getSponsorContribution(</span><b>"0x5E2966E536414867Ff9D8804718000229960d15F"</b><span style="font-weight: 400;">).send()</span>
```

<span style="font-weight: 400;">It will return 0, because we haven’t called addTree yet.</span>

<span style="font-weight: 400;">So try adding a tree:</span>

```
<span style="font-weight: 400;">forest.addTree(</span><b>new </b><span style="font-weight: 400;">BigInteger(</span><b>"2000"</b><span style="font-weight: 400;">)).send()</span>
```

<span style="font-weight: 400;">And again get contribution and we will get the percentage of 100.</span>

<span style="font-weight: 400;">You can see all your transactions [here](https://ropsten.etherscan.io):</span><span style="font-weight: 400;"> just search for your contract address.</span>

### <span style="font-weight: 400;">Conclusion</span>

<span style="font-weight: 400;">Now you know how to:</span>

- <span style="font-weight: 400;">Write simple contracts and run them in sandbox;</span>
- <span style="font-weight: 400;">How to create an Ethereum account and get its credentials;</span>
- <span style="font-weight: 400;">How to start your own Ethereum node;</span>
- <span style="font-weight: 400;">How to connect to Ethereum network from your Java code.</span>