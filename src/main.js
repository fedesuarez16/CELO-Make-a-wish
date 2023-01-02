  import Web3 from "web3"
  import { newKitFromWeb3 } from "@celo/contractkit"
  import BigNumber from "bignumber.js"
  import marketplaceAbi from "../contract/marketplace.abi.json"
  import erc20Abi from "../contract/erc20.abi.json"

  const ERC20_DECIMALS = 18
  const MPContractAddress = "0x8aE12cd1E825ce5029883EFc76Ede4Ae348a05bf"
  const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

  let kit
  let contract
  let approve
  let cUSDContract



  const connectCeloWallet = async function () {
    if (window.celo) {
      notification("⚠️ Please approve this DApp to use it.")
      try {
        await window.celo.enable()
        notificationOff()

        const web3 = new Web3(window.celo)
        kit = newKitFromWeb3(web3)

        const accounts = await kit.web3.eth.getAccounts()
        kit.defaultAccount = accounts[0]

        contract = new kit.web3.eth.Contract(marketplaceAbi, MPContractAddress)
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
    } else {
      notification("⚠️ Please install the CeloExtensionWallet.")
    }
  }



function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}

function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

window.addEventListener("load", async () => {
  notification("⌛ Loading...")
  await connectCeloWallet()
  await getBalance()
  await getFundRaisingGoal()
  await getFundsState()
  await cUSDBalance()
  notificationOff()
});



const getBalance = async function () {
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
}


 document.querySelector("#fund-project-button-celo").addEventListener('click', async () => {

   const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

    // Convert the string value to a BigNumber object
   let amount = new BigNumber(document.getElementById("fund-project-amount-celo").value)
    // Shift the value by the number of decimals
   amount = amount.shiftedBy(ERC20_DECIMALS)

   if (!kit.defaultAccount) {
      notification("⌛ you must autenticate...");
      return;
      }
 
      //  Check that the params is greater than 0
      if (amount <= 0) {

         notification("⌛ The amount must be greater than 0...");
         return;
      }

     
       await contract.methods.fundProject(amount).send({ from: kit.defaultAccount, value: amount });


      await getFundsState()
         notification("you transfered succesfully")
 });


document.querySelector("#fund-project-button").addEventListener('click', async () => {

  const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

  // Convert the string value to a BigNumber object
  let amount = new BigNumber(document.getElementById("fund-project-amount").value)
  // Shift the value by the number of decimals
  amount = amount.shiftedBy(ERC20_DECIMALS)

  if (!kit.defaultAccount) {
     notification("⌛ you must autenticate...");
     return;
     }
 
     // Check that the params is greater than 0
     if (amount <= 0) {

        notification("⌛ The amount must be greater than 0...");
        return;
     }

     
  // await contract.methods.fundProject(amount).send({ from: kit.defaultAccount, value: amount });

     await cUSDContract.methods.transfer(MPContractAddress, amount).send({ from: kit.defaultAccount })

     await getFundsState()
        notification("you transfered succesfully")
});


async function getFundRaisingGoal() {
  // Call the contract's getFundRaisingGoal function
  const goal = await contract.methods.getFundRaisingGoal().call();
  document.getElementById('fundraising-goal').textContent = goal;

  return goal;
}


async function getFundsState() {
  // Call the contract's getFundsState function
  const funds = await contract.methods.getFundsState().call();
  // Convert the funds value to a BigNumber object
  const bnFunds = new BigNumber(funds)
  // Divide the value by the number of decimals to convert it to a human-readable amount
  const humanReadableAmount = bnFunds.dividedBy(Math.pow(10, ERC20_DECIMALS))
  // Round the value to the nearest integer
  const intFunds = humanReadableAmount.toFixed(0)
  // Convert the integer value to a string
  const strFunds = intFunds.toString()
  document.getElementById('funds-raised').textContent = strFunds;

  return strFunds;
}

const cUSDBalance = async function () {
  const totalBalance = await kit.getTotalBalance(MPContractAddress)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#funds-raised-cusd").textContent = cUSDBalance
}



document.querySelector("#change-project-state-button").addEventListener('click', async () => {
  // Get the value selected by the user from the dropdown menu
  const newState = document.querySelector("#change-project-state-select").value;

  // Check that the user is authenticated
  if (!kit.defaultAccount) {
    notification("you must be authenticated to change the fundraising state")
  }

  // Check that the new state is valid
  if (newState !== '0' && newState !== '1') {
    notification("invalid state")
  }

  // Call the contract's changeProjectState function
  await contract.methods.changeProjectState(newState).send({ from: kit.defaultAccount });

  notification("you changed the fundraising state")
});
















// //   // Check that the user is authenticated
//    if (!web3.eth.defaultAccount) {
//   throw new Error('You must be authenticated to fund the project');
//    }

//    // Check that the params is greater than 0
//    if (params <= 0) {
//      throw new Error('The amount must be greater than 0');
//    }

//    // Call the contract's fundProject function
//    await contract.methods.fundProject(params).send({ from: web3.eth.defaultAccount, value: params });


  
//document.querySelector("#newDonationBtn")
// //    .addEventListener("click", async (e) => {


//  const getFundraisingGoal = async function () {
//     const Goal = await contract.methods
//     .getFundRaisingGoal().call()
//     document.querySelector("#goal").textContent = Goal

//     return Goal
//   }
//  getFundraisingGoal()
 
// const getStatus () = async function (){
// const Status = await contract.methods
// .
// }



// async function approve(_price) {
//   const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

 

//   const result = await cUSDContract.methods
//     .approve(MPContractAddress, _price)
//     .send({ from: kit.defaultAccount })
//   return result
// }
// }


// const getBalance = async function () {
//   const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
//   const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
//   document.querySelector("#balance").textContent = cUSDBalance
// }



// function notification(_text) {
//   document.querySelector(".alert").style.display = "block"
//   document.querySelector("#notification").textContent = _text
// }

// function notificationOff() {
//   document.querySelector(".alert").style.display = "none"
// }

// window.addEventListener("load", async () => {
//   notification("⌛ Loading...")
//   await connectCeloWallet()
//   await getBalance()
//   notificationOff()







  
//   document.querySelector("#newDonationBtn")
//     .addEventListener("click", async (e) => {

//    let params = [
 
//      document.getElementById("NewDonation").value
//       .shiftedBy(ERC20_DECIMALS)
//       .toString()
//    ]

//   // 10. Get your account
//   let accounts = await kit.web3.eth.getAccounts();
//   kit.defaultAccount = accounts[0];
//   // paid gas in cUSD
//   await kit.setFeeCurrency(CeloContract.StableToken);


// // 11. Add your account to ContractKit to sign transactions
// // kit.connection.addAccount(account.privateKey);

// // 12. Specify recipient Address
// let anAddress = MPContractAddress;

// // 13. Specify an amount to send

// const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)


// // 14. Get the token contract wrappers
// let cUSDtoken = await kit.contracts.getStableToken();

// // 15. Transfer CELO and cUSD from your account to anAddress
// // Optional: specify the feeCurrency, default feeCurrency is CELO

// // let cUSDtx = await cUSDtoken
// //   .transfer(anAddress, params)
// //   .send({ from: kit.defaultAccount});

// if(params != 0 ) {
//   notification(`⚠️ Empty message...`);

// }

// try {

// // const tx =  kit.sendTransaction({
// //   from: kit.defaultAccount,
// //   to: anAddress,
// //   value: params,
// // });
// let cUSDcontract = await kit.contracts.getStableToken();
// let cUSDtx = await cUSDcontract
//   .transfer(anAddress, params)
//   .send({ feeCurrency: cUSDcontract.address });

//   cUSDtx

// }    catch (error) {
//   notification(`⚠️ ${error}.`)
// }
// // const result = await contract.methods
// //         .transfer(anAddress ,params)
// //         .send({ from: kit.defaultAccount })
// // result


// // 16. Wait for the transactions to be processed
// // let cUSDReceipt = await cUSDtx.waitReceipt();

// // // 17. Print receipts
// // console.log("cUSD Transaction receipt: %o", cUSDReceipt);

// // // 18. Get your new balances
// // let cUSDBalance = await cUSDtoken.balanceOf(account.address);

// // // 19. Print new balance
// // console.log(`Your new account cUSD balance: ${cUSDBalance.toString()}`);


// });




// })








// //  document.querySelector("#newDonationBtn")
// //    .addEventListener("click", async (e) => {

// //   let params = [
 
// //     new BigNumber(document.getElementById("NewDonation").value)
// //     .shiftedBy(ERC20_DECIMALS)
// //     .toString()
// //   ]
// //   let account = await kit.web3.eth.getAccounts();

// //   let anAddress = MPContractAddress;

// //   kit.connection.addAccount(account.privateKey);


// //   let cUSDtoken = await kit.contracts.getStableToken();



// //   kit.defaultAccount = accounts[0];
// //   // paid gas in cUSD
// //   await kit.setFeeCurrency(CeloContract.StableToken);


// //   let cUSDcontract = await kit.contracts.getStableToken();
// // let cUSDtx = await cUSDcontract
// //   .transfer(  anAddress , params)
// //   .send({ from: accounts.address, feeCurrency: cUSDtoken.address});

  
// //   cUSDtx()

// // })
















//   // 10. Get your account
// // let account = await getAccount();

// // 11. Add your account to ContractKit to sign transactions
// // kit.connection.addAccount(account.privateKey);

// // 12. Specify recipient Address
// // let anAddress = "0x8B110dCECe49d855D00c2FDa3F8f6C396B5c6245";

// // 13. Specify an amount to send
// // let amount = document.getElementById("NewDonation").value
// // .shiftedBy(ERC20_DECIMALS)
// // .toString()


// // 14. Get the token contract wrappers
// // let cUSDtoken = await kit.contracts.getStableToken();

// // 15. Transfer CELO and cUSD from your account to anAddress
// // Optional: specify the feeCurrency, default feeCurrency is CELO

// // let cUSDContract = await kit.contracts.getStableToken();
// // let cUSDtx = await cUSDcontract
// //   .transfer(MPContractAddress, params)
// //   .approve()
// //   .send();

// // let tx =  await cUSDContract.methods
// //   .approve(MPContractAddress, params)
// //   .send({ from: kit.defaultAccount })
// // return result

// // let cUSDtx = await cUSDtoken
// //   .transfer(anAddress, params)
// //   .send({ from: account.address, feeCurrency: cUSDtoken.address });

// // 16. Wait for the transactions to be processed
// // let cUSDReceipt = await cUSDtx.waitReceipt();

// // 17. Print receipts
// // console.log("cUSD Transaction receipt: %o", cUSDReceipt);

// // 18. Get your new balances
// // let cUSDBalance = await cUSDtoken.balanceOf(account.address);

// // 19. Print new balance
// // console.log(`Your new account cUSD balance: ${cUSDBalance.toString()}`);













// // document
// //   .querySelector("#newDonationBtn")
// //   .addEventListener("click", async function send(e)  {
// //     // 10. Get your account
// //   // let account = await getAccount();
  
// //   // 11. Add your account to ContractKit to sign transactions
// //   // kit.connection.addAccount(account.privateKey);

// //   // 12. Specify recipient Address
// //   // let anAddress = "0x8B110dCECe49d855D00c2FDa3F8f6C396B5c6245";

   
  
  
  
// //   // const amount = (document.getElementById("NewDonation").value).shiftedBy(-ERC20_DECIMALS).toString();

  
    


// //   // 13. Specify an amount to send
// //   // .shiftedBy(-ERC20_DECIMALS)
// //   // .toString()

  
 


// //   // 14. Get the token contract wrappers
// //   let cUSDtoken = await kit.contracts.getStableToken();

// //   // 15. Transfer CELO and cUSD from your account to anAddress
// //   // Optional: specify the feeCurrency, default feeCurrency is CELO
  

  
// //     let cUSDtx = await cUSDtoken
// //       .transfer(MPContractAddress , params)
// //       .send({ from: kit.defaultAccount , feeCurrency: cUSDtoken.address });




//   // const tx = kit.sendTransaction({
//   //   from: kit.defaultAccount,
//   //   to: MPContractAddress,
//   //   value: params,
//   // });
  
//   // // 16. Wait for the transactions to be processed
//    let cUSDReceipt = await cUSDtx.waitReceipt();

//   // // 17. Print receipts
//   // console.log("cUSD Transaction receipt: %o", cUSDReceipt);

//   // // 18. Get your new balances
//    let cUSDBalance = await cUSDtoken.balanceOf(account.address);

//   // // 19. Print new balance
//   // console.log(`Your new account cUSD balance: ${cUSDBalance.toString()}`);

  
// })

/*const params =[
new BigNumber(document.getElementById("newDonation").value)
.shiftedBy(ERC20_DECIMALS)
.toString()



/*document.querySelector("#marketplace").addEventListener("click", async (e) => {
  if (e.target.className.includes("buyBtn")) {
    const index = e.target.id
    notification("⌛ Waiting for payment approval...")
    try {
      await approve(products[index].price)
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`⌛ Awaiting payment for "${products[index].name}"...`)
    try {
      const result = await contract.methods
        .buyProduct(index)
        .send({ from: kit.defaultAccount })
      notification(`🎉 You successfully bought "${products[index].name}".`)
      getProducts()
      getBalance()
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  }
}) */































  
//   // Create an instance of the contract
//   // const contract = new Web3.eth.Contract(marketplaceAbi, MPContractAddress)


// // Postulate as a candidate
// const formPostulate = document.getElementById('form-postulate');
// formPostulate.addEventListener('submit', (event) => {
//   event.preventDefault();

//   // Get the candidate name from the form
//   const candidateName = document.getElementById('candidate-name').value;

//   // Postulate as a candidate
//   contract.methods.postulate(candidateName).send({ from: kit.defaultAccount })
//     .then(() => {
//       console.log('Successfully postulated as a candidate');
//     })
//     .catch((error) => {
//       console.error(error);
//     });
  
  
// });

// // Cast a vote
// const formVote = document.getElementById('form-vote');
// formVote.addEventListener('submit', (event) => {
//   event.preventDefault();
  

//   // Get the candidate name from the form
//   const candidateName = document.getElementById('candidate-name').value;
//   // Cast a vote for the candidate
//   contract.methods.vote(candidateName).send({ from: kit.defaultAccount  })
//     .then(() => {
//       console.log('Successfully cast vote');
//     })
//     .catch((error) => {
//       console.error(error);
//     });


// // Get the number of votes received by a candidate
// const votesReceived = document.getElementById('votes-received');
// contract.methods.getVotes('').call()
//   .then((votes) => {
//     votesReceived.innerHTML = votes;
//   })
//   .catch((error) => {
//     console.error(error);
//   });



  
// const getCandidates = async function (){

//   const candidates =  contract.methods.getCandidate(  ).call()
//   document.getElementById('candidates').textContent;

// return candidates

// }
// getCandidates()

// });

