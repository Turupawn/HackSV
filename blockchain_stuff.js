const NETWORK_ID = 4
const JSON_CONTRACT_PATH = "./contracts/MyNFT.json"
var contract
var accounts
var web3
var balance

function metamaskReloadCallback()
{
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Accounts changed, realoading...";
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Network changed, realoading...";
    window.location.reload()
  })
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if(document.readyState=="complete")
    {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        window.location.reload()
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent="Error: Please install Metamask";
      }
    }else
    {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent="Error: Please install Metamask";
        }
      });
    }
  });
};

const getContract = async (web3) => {
  const response = await fetch(JSON_CONTRACT_PATH);
  const data = await response.json();
  
  const netId = NETWORK_ID;
  const deployedNetwork = NETWORK_ID;
  contract = new web3.eth.Contract(
    data.abi,
    "0x3aB34DD60c98667c95b3624d367bB675CFC153c7"
    );
  return contract
}

async function loadDapp() {
  metamaskReloadCallback()
  document.getElementById("web3_message").textContent="Plase connect to Metamask"
  var awaitWeb3 = async function () {
    web3 = await getWeb3()
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID) {
        var awaitContract = async function () {
          contract = await getContract(web3);
          await window.ethereum.request({ method: "eth_requestAccounts" })
          accounts = await web3.eth.getAccounts()
          balance = await contract.methods.balanceOf(accounts[0]).call()
          document.getElementById("web3_message").textContent="You have " + balance + " NFTs"
        };
        awaitContract();
      } else {
        document.getElementById("web3_message").textContent="Please connect to Rinkeby Testnet";
      }
    });
  };
  awaitWeb3();
}

const collect = async (amount) => {
  const result = await contract.methods.mint(web3.utils.toWei(''+amount, 'ether'))
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
    });
}

const payEntry = async () => {
  const result = await contract.methods.transfer("0x6927A687175d2fa9c2784ac2b885f0f88bC2ee43", web3.utils.toWei(''+5, 'ether'))
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
      console.log("tx in progress")
    })
    .on('receipt', function(receipt){
      console.log("txed")
      initGame()  
    })
    .catch((revertReason) => {
      console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
    });
}

loadDapp()