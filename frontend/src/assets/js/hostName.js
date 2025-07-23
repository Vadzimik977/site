// var HOST = "http://localhost:3000";
var HOST = "http://syndicateanimalscyberpunk.fun:8000";

async function checkServer() {
  try {
    const response = await fetch(HOST + "/planet-taps");
    if (response.ok) {
    } else {
      HOST = "http://syndicateanimalscyberpunk.fun:8000";
    }
  } catch (error) {
    HOST = "http://localhost:3000";
  }
}

checkServer();


const tonAdres = localStorage.getItem("ton-connect-storage_bridge-connection")
const parsedData = JSON.parse(tonAdres);

var addres = parsedData ? parsedData.connectEvent?.payload?.items[0]?.address : 0;
// var TonUrl=`https://tap-tau.vercel.app`
var TonUrl=`https://tap-tau.vercel.app`