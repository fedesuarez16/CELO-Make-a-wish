import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import marketplaceAbi from "../contract/marketplace.abi.json"
import erc20Abi from "../contract/erc20.abi.json"

const ERC20_DECIMALS = 18
const MPContractAddress = "0x8aE12cd1E825ce5029883EFc76Ede4Ae348a05bf"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
const contractOwner = "0xA347A6DBCaBbe179dd5EFcF9b6A9606f65a1A511"


let kit
let contract




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


// Fund CELO function 


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

    //  Check that the amount is greater than 0
    if (amount <= 0) {

       notification("⌛ The amount must be greater than 0...");
       return;
    }

    //transfer the amoutn
     await contract.methods.fundProject(amount).send({ from: kit.defaultAccount, value: amount });


    await getFundsState()
       notification("you transfered succesfully")

       await getBalance()

});

//Transfer cUSD function 


document.querySelector("#fund-project-button").addEventListener('click', async () => {

const newState = document.querySelector("#change-project-state-select").value;
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
   if( newState == 1) {

   notification("The fundraising is inactive, you cannot fund")
   return;
 }

   
    //transfer amount in cUSD
    
   await cUSDContract.methods.transfer(MPContractAddress, amount).send({ from: kit.defaultAccount })

   await cUSDBalance()
      notification("you transfered succesfully")

      await getBalance()

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

// Check that the user is the owner
if (kit.defaultAccount !== contractOwner) {
  notification("you must be the owner to change the fundraising state");
  return;
}

// Check that the new state is valid
if (newState !== '0' && newState !== '1') {
    notification("invalid state")
}

// Call the contract's changeProjectState function
await contract.methods.changeProjectState(newState).send({ from: kit.defaultAccount });

notification("you changed the fundraising state")


// Update the project state in the UI
});











