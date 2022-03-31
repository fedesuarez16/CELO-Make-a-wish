import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import marketplaceAbi from "../contract/marketplace.abi.json"
import erc20Abi from "../contract/erc20.abi.json"

const ERC20_DECIMALS = 18
const MPContractAddress = "0x8B110dCECe49d855D00c2FDa3F8f6C396B5c6245"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

let kit
let contract


//window.ethereum.request({method:'eth_requestAccounts'})


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

async function approve(_price) {
  const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

  const result = await cUSDContract.methods
    .approve(MPContractAddress, _price)
    .send({ from: kit.defaultAccount })
  return result
}

const getBalance = async function () {
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
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
  notificationOff()
});


async function send() {
    // 10. Get your account
  let account = await getAccount();

  // 11. Add your account to ContractKit to sign transactions
  kit.connection.addAccount(account.privateKey);

  // 12. Specify recipient Address
  let anAddress = "0x8B110dCECe49d855D00c2FDa3F8f6C396B5c6245";

  // 13. Specify an amount to send
  let amount = document.getElementById("NewDonation").value
  .shiftedBy(ERC20_DECIMALS)
  .toString()


  // 14. Get the token contract wrappers
  let cUSDtoken = await kit.contracts.getStableToken();

  // 15. Transfer CELO and cUSD from your account to anAddress
  // Optional: specify the feeCurrency, default feeCurrency is CELO
  
  let cUSDtx = await cUSDtoken
    .transfer(anAddress, amount)
    .send({ from: account.address, feeCurrency: cUSDtoken.address });
  
  // 16. Wait for the transactions to be processed
  let cUSDReceipt = await cUSDtx.waitReceipt();

  // 17. Print receipts
  console.log("cUSD Transaction receipt: %o", cUSDReceipt);

  // 18. Get your new balances
  let cUSDBalance = await cUSDtoken.balanceOf(account.address);

  // 19. Print new balance
  console.log(`Your new account cUSD balance: ${cUSDBalance.toString()}`);
}
send


/*const params =[
new BigNumber(document.getElementById("newDonation").value)
.shiftedBy(ERC20_DECIMALS)
.toString()

]; */


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
})   */