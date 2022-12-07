import React from "react";
import HeadComponent from '../components/Head';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Product from "../components/Product"
import CreateProduct from "../components/CreateProduct";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Constants
const TWITTER_HANDLE = "_aic";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { publicKey } = useWallet();
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false );
  const [creating, setCreating] = useState(false);
  const [products, setProducts] = useState([]);
  
  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>    
    </div>
  );
  
  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);

  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <div className="App">
      <HeadComponent/>
      <div className="container">
        <header className="header-container">
          <p className="header">AIC DAO STORE</p>
          <p className="sub-text">Weekly publication for places to see around the world by AI CITY DAO  🏙🌇🌆🌃 </p>
          <p className="sub-text">🥐🥞🥯🍵☕️🧋🍔🌮🍕🍺🍸🪩</p>
          <img width="750" height="400" src="https://media.giphy.com/media/1Rj8aaXgAvMoGN2bYu/giphy.gif" alt="emoji" />

          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create Product"}
            </button>
          )}
        </header>

        <main>
          {creating && <CreateProduct />}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};
  
export default App;