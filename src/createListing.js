import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { LEASEAGREEMENTFACTORY_ADDRESS, LEASEAGREEMENTFACTORY_ABI } from './contracts/LeaseAgreementFactory.js';


function CreateListing() {
  const navigate = useNavigate();

  // State hooks to store form field values
  const [tokenId, setTokenId] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you would handle the form submission to the blockchain or server...
    const listingData = {
      tokenId: parseInt(tokenId),
      rentalPrice: parseInt(rentalPrice),
      depositAmount: parseInt(depositAmount),
      leaseDuration: parseInt(leaseDuration),
    };

    // Assuming 'window.ethereum' is available in the global scope.
    let provider = window.ethereum;

    try {
        // Request account access if needed
        await provider.request({ method: 'eth_requestAccounts' });

        // Create an instance of Web3 using the provider
        const web3 = new Web3(provider);

        // Create a new contract instance with the provided ABI and address
        const contract = new web3.eth.Contract(LEASEAGREEMENTFACTORY_ABI, LEASEAGREEMENTFACTORY_ADDRESS);

        // Get accounts from the provider
        const accounts = await web3.eth.getAccounts();

        // Check if we have accounts available
        if (accounts.length === 0) {
            throw new Error("No accounts available. Please connect to MetaMask.");
        }

        // Call the smart contract method with the provided parameters and send a transaction
        const result = await contract.methods.createLeaseContract(tokenId, rentalPrice, depositAmount, leaseDuration)
                                              .send({ 
                                                from: accounts[0],
                                                gas: '1000000',
                                                gasPrice: 1000000000
                                               }); // Using the first account to send the transaction

        // Log the transaction receipt to console
        console.log('Transaction receipt:', result);

        // Optionally navigate back to the home page or another appropriate page
        navigate('/'); // Assuming you have a navigation function set up
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Error creating lease contract:', error);
    }
  };

  return (
    <div>
      <div className="container mt-3">
        <h2>Create Listing</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="tokenId" className="form-label">Token ID</label>
            <input
              type="number"
              className="form-control"
              id="tokenId"
              placeholder="Enter token ID"
              required
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <div className="form-text">Enter the token ID of the property to be leased that has not been listed.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="rentalPrice" className="form-label">Rental Price</label>
            <input
              type="number"
              className="form-control"
              id="rentalPrice"
              placeholder="Enter rental price per period"
              required
              value={rentalPrice}
              onChange={(e) => setRentalPrice(e.target.value)}
            />
            <div className="form-text">Set the rental price per payment period.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="depositAmount" className="form-label">Deposit Amount</label>
            <input
              type="number"
              className="form-control"
              id="depositAmount"
              placeholder="Enter deposit amount"
              required
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <div className="form-text">Specify the deposit required to secure the lease.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="leaseDuration" className="form-label">Lease Duration</label>
            <input
              type="number"
              className="form-control"
              id="leaseDuration"
              placeholder="Enter lease duration"
              required
              value={leaseDuration}
              onChange={(e) => setLeaseDuration(e.target.value)}
            />
            <div className="form-text">Define the duration of the lease in payment periods.</div>
          </div>
          <button type="submit" className="btn btn-primary">Submit Listing</button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
