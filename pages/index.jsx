import { useState } from 'react'
import {NFTCard} from "./components/NFTCard"

const Home = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    console.log('fetching nfts');
    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collectionAddress.length) {
      // we do not want to filter by collection
      console.log('Fetching all nfts owned by address');

      var requestOptions = {
        method: 'GET'
      };
      const fetchURL = `${baseURL}?owner=${walletAddress}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    } else {
      // we want to filter by collection
      console.log('Fetching nfts for a specific collection owned by address');
      const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }

    if (nfts) {
      console.log(nfts);
      setNFTs(nfts.ownedNfts);
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collectionAddress) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = process.env.NEXT_PUBLIC_API_KEY;
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      if (nfts) {
        console.log('Collection %o', nfts);
        setNFTs(nfts.nfts);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => {setWalletAddress(e.target.value)}} type={"text"} placeholder="Add your wallet address" value={walletAddress}></input>
          <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) =>{setCollectionAddress(e.target.value)}} type={"text"} placeholder="Add the collection address" value={collectionAddress}></input>
          <label className="text-gray-600"><input type={"checkbox"} className="mr-2" onChange={ (e) => {
            setFetchForCollection(e.target.checked);
          }}></input>Fetch for collection</label>
          <button className="rounded-sm w-1/5 px-4 py-2 mt-3 text-white bg-blue-400 disabled:bg-slate-500" onClick={() => {
              if (!fetchForCollection) {
                fetchNFTs();
              } else {
                fetchNFTsForCollection();
              }
            }}>
            Search NFTs
          </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {
          NFTs.length && NFTs.map( nft => {
            return (
              <NFTCard nft={nft} />
            );
          })
        }
      </div>
    </div>
  );
}

export default Home;