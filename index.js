'use strict';

// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack

  const bananoUtil = require('./app/scripts/banano-util.js');
  const realBananodeApi = require('./app/scripts/bananode-api.js');
  const camoUtil = require('./app/scripts/camo-util.js');
  const depositUtil = require('./app/scripts/deposit-util.js');
  const withdrawUtil = require('./app/scripts/withdraw-util.js');
  const loggingUtil = require('./app/scripts/logging-util.js');

  const BANANO_PREFIX = 'ban_';

  const NANO_PREFIX = 'nano_';

  let bananodeApi = realBananodeApi;

  /**
 * Sets the Bananode Api (useful for overriding some methods)
 * @memberof Main
 * @param {string} _bananodeApi the new bananodeApi
 * @return {undefined} returns nothing.
 */
  const setBananodeApi = (_bananodeApi) => {
    bananodeApi = _bananodeApi;
  };

  /**
   * Sends the amount to the account with an optional representative and
   * previous block hash.
   * If the representative is not sent, it will be pulled from the api.
   * If the previous is not sent, it will be pulled from the api.
   * Be very careful with previous, as setting it incorrectly
   * can cause an incorrect amount of funds to be sent.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} representative the representative (optional).
   * @param {string} previousHash the previous hash (optional).
   * @return {string} returns the hash returned by the send.
   */
  const sendAmountToBananoAccountWithRepresentativeAndPrevious = async (seed, seedIx, destAccount, amountRaw, representative, previousHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, representative, previousHash, BANANO_PREFIX);
    return hash;
  };

  /**
   * Sends the amount to the account with an optional representative and
   * previous block hash.
   * If the representative is not sent, it will be pulled from the api.
   * If the previous is not sent, it will be pulled from the api.
   * Be very careful with previous, as setting it incorrectly
   * can cause an incorrect amount of funds to be sent.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} representative the representative (optional).
   * @param {string} previousHash the previous hash (optional).
   * @return {string} returns the hash returned by the send.
   */
  const sendAmountToNanoAccountWithRepresentativeAndPrevious = async (seed, seedIx, destAccount, amountRaw, representative, previousHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, representative, previousHash, NANO_PREFIX);
    return hash;
  };

  /**
 * Sends the amount to the banano account with a callback for success and failure.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} destAccount the destination account.
 * @param {string} amountRaw the amount to send, in raw.
 * @param {string} successCallback the callback to call upon success.
 * @param {string} failureCallback the callback to call upon failure.
 * @return {string} returns the hash returned by the send.
 */
  const sendAmountToBananoAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
    return await bananoUtil.send(bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback, BANANO_PREFIX)
        .catch((error) => {
        // console.trace(error);
          throw Error(error);
        });
  };

  /**
 * Sends the amount to the nano account with a callback for success and failure.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} destAccount the destination account.
 * @param {string} amountRaw the amount to send, in raw.
 * @param {string} successCallback the callback to call upon success.
 * @param {string} failureCallback the callback to call upon failure.
 * @return {string} returns the hash returned by the send.
 */
  const sendAmountToNanoAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
    return await bananoUtil.send(bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback, NANO_PREFIX)
        .catch((error) => {
        // console.trace(error);
          throw Error(error);
        });
  };

  /**
   * Sets the rep for an account with a given seed.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @return {string} returns the hash returned by the change.
   */
  const changeBananoRepresentativeForSeed = async (seed, seedIx, representative) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = await bananoUtil.change(bananodeApi, privateKey, representative, BANANO_PREFIX);
    return response;
  };

  /**
   * Sets the rep for an account with a given seed.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @return {string} returns the hash returned by the change.
   */
  const changeNanoRepresentativeForSeed = async (seed, seedIx, representative) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = await bananoUtil.change(bananodeApi, privateKey, representative, NANO_PREFIX);
    return response;
  };

  /**
   * Recieve deposits for a nano account with a given seed.
   * @memberof DepositUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} specificPendingBlockHash a specific block hash to receive (optional).
   * @return {object} returns the response returned by the receive.
   */
  const receiveNanoDepositsForSeed = async (seed, seedIx, representative, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, NANO_PREFIX);
    const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, NANO_PREFIX);
    return response;
  };

  /**
   * Recieve deposits for a nano account with a given seed.
   * @memberof DepositUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} specificPendingBlockHash a specific block hash to receive (optional).
   * @return {object} returns the response returned by the receive.
   */
  const receiveBananoDepositsForSeed = async (seed, seedIx, representative, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, BANANO_PREFIX);
    const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, BANANO_PREFIX);
    return response;
  };

  /**
 * Send a withdrawal from a banano account with a given seed.
 * @memberof WithdrawUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {object} returns the response returned by the withdraw.
 */
  const sendBananoWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = withdrawUtil.withdraw(loggingUtil, bananodeApi, privateKey, toAccount, amountBananos, BANANO_PREFIX);
    return response;
  };

  /**
 * Send a withdrawal from a nano account with a given seed.
 * @memberof WithdrawUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {object} returns the response returned by the withdraw.
 */
  const sendNanoWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = withdrawUtil.withdraw(loggingUtil, bananodeApi, privateKey, toAccount, amountBananos, NANO_PREFIX);
    return response;
  };

  /**
 * Get the balance, in raw, for an account.
 *
 * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @return {string} the account's balance, in raw.
 */
  const getAccountBalanceRaw = async (account) => {
    return await bananodeApi.getAccountBalanceRaw(account);
  };

  /**
 * Get the history for an account.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_history}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @param {string} count the count to use (use -1 for all).
 * @param {string} head the head to start at (optional).
 * @param {string} raw if true, return raw history (optional).
 * @return {object} the account's history.
 */
  const getAccountHistory = async (account, count, head, raw) => {
    return await bananodeApi.getAccountHistory(account, count, head, raw);
  };

  /**
   * Get the banano account with a given seed and index.
   *
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @return {string} the account.
   */
  const getBananoAccountFromSeed = (seed, seedIx) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, BANANO_PREFIX);
    return account;
  };

  /**
   * Get the banano account with a given seed and index.
   *
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @return {string} the account.
   */
  const getNanoAccountFromSeed = (seed, seedIx) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, NANO_PREFIX);
    return account;
  };

  /**
 * Sets the URL to use for the node behind the Bananode Api
 * @memberof Main
 * @param {string} url the new url
 * @return {undefined} returns nothing.
 */
  const setBananodeApiUrl = (url) => {
    bananodeApi.setUrl(url);
  };

  /**
 * Get the account info for an account.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_info}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @param {boolean} representativeFlag the representativeFlag to use (optional).
 * @return {object} the account's info.
 */
  const getAccountInfo = async (account, representativeFlag) => {
    return await bananodeApi.getAccountInfo(account, representativeFlag);
  };

  /**
 * Get the network block count.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#block_count}
 * @memberof BananodeApi
 * @return {object} the block count.
 */
  const getBlockCount = async () => {
    return await bananodeApi.getBlockCount();
  };

  /**
 * Open a banano account with a given seed.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} representative the representative.
 * @param {string} pendingBlockHash the pending block hash.
 * @param {string} pendingValueRaw the pending block hash.
 * @return {string} returns the hash returned by the open.
 */
  const openBananoAccountFromSeed = async (seed, seedIx, representative, pendingBlockHash, pendingValueRaw) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getPublicKey(privateKey);
    return await bananoUtil.open(bananodeApi, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw, BANANO_PREFIX);
  };

  /**
 * Open a nano account with a given seed.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} representative the representative.
 * @param {string} pendingBlockHash the pending block hash.
 * @param {string} pendingValueRaw the pending block hash.
 * @return {string} returns the hash returned by the open.
 */
  const openNanoAccountFromSeed = async (seed, seedIx, representative, pendingBlockHash, pendingValueRaw) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getPublicKey(privateKey);
    return await bananoUtil.open(bananodeApi, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw, NANO_PREFIX);
  };


  /**
 * Get the hash for a given block.
 *
 * @memberof BananoUtil
 * @param {string} block the seed to use to find the account.
 * @return {string} the block's hash.
 */
  const getBlockHash = (block) => {
    return bananoUtil.hash(block);
  };


  /**
 * Get the signature for a given block (gets the hash of the block, and signs the hash).
 *
 * @memberof BananoUtil
 * @param {string} privateKey the private key used to sign the block.
 * @param {string} block the block to sign.
 * @return {string} the block's signature.
 */
  const getSignature = (privateKey, block) => {
    return bananoUtil.sign(privateKey, block);
  };

  /**
 * Converts a hex string to bytes in a Uint8Array.
 *
 * @memberof BananoUtil
 * @param {string} hex the hex string to use.
 * @return {Uint8Array} the bytes in a Uint8Array.
 */
  const getBytesFromHex = (hex) => {
    return bananoUtil.hexToBytes(hex);
  };

  /**
 * gets work bytes using the CPU.
 *
 * @memberof BananoUtil
 * @param {string} hash the hash to use to calculate work bytes.
 * @param {Uint8Array} workBytes the Uint8Array(8) used to store temporary calculations.
 * @return {string} the work bytes as a hex string.
 */
  const getWorkUsingCpu = (hash, workBytes) => {
    return bananoUtil.getHashCPUWorker(hash, workBytes);
  };

  /**
   * receives banano funds at a camo address.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {string_array} the received hashes in an array.
   */
  const camoBananoReceive = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.receive( bananodeApi, toPrivateKey, fromPublicKey, BANANO_PREFIX);
  };

  /**
   * receives nano funds at a camo address.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {string_array} the received hashes in an array.
   */
  const camoNanoReceive = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.receive( bananodeApi, toPrivateKey, fromPublicKey, NANO_PREFIX);
  };

  /**
   * finds a new private key to recieve more banano funds. the key would have no history.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @return {string} the private key to use.
   */
  const getCamoBananoNextPrivateKeyForReceive = async (seed) => {
    return await camoUtil.getFirstUnopenedPrivateKey( bananodeApi, seed, BANANO_PREFIX );
  };

  /**
   * finds a new private key to recieve more banano funds. the key would have no history.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @return {string} the private key to use.
   */
  const getCamoNanoNextPrivateKeyForReceive = async (seed) => {
    return await camoUtil.getFirstUnopenedPrivateKey( bananodeApi, seed, NANO_PREFIX );
  };

  /**
 * sends banano funds to a camo address.
 *
 * @memberof CamoUtil
 * @param {string} fundingPrivateKey the private key that sends the funds.
 * @param {string} fromCamoPrivateKey the private key used to generate the shared seed.
 * @param {string} toCamoPublicKey the public key that receives the funds.
 * @param {string} amountBananos the amount of bananos.
 * @return {string_array} the sent hashes in an array.
 */
  const camoBananoSend = async (fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos) => {
    const amountRaw = getRawStrFromBananoStr(amountBananos);
    return await camoUtil.send( bananodeApi, fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountRaw, BANANO_PREFIX);
  };

  /**
 * sends camo funds to a camo address.
 *
 * @memberof CamoUtil
 * @param {string} fundingPrivateKey the private key that sends the funds.
 * @param {string} fromCamoPrivateKey the private key used to generate the shared seed.
 * @param {string} toCamoPublicKey the public key that receives the funds.
 * @param {string} amountBananos the amount of bananos.
 * @return {string_array} the sent hashes in an array.
 */
  const camoNanoSend = async (fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos) => {
    const amountRaw = getRawStrFromNanoStr(amountBananos);
    return await camoUtil.send( bananodeApi, fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountRaw, NANO_PREFIX);
  };

  /**
 * sends banano funds to a camo account.
 * This function uses seed index 0 to generate the shared secret,
 * and seed index "seedIx" to get the private key that contains funds to send.
 *
 * @memberof CamoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {string_array} the sent hashes in an array.
 */
  const camoBananoSendWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const accountValid = getCamoAccountValidationInfo(toAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const fundingPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromCamoPrivateKey = bananoUtil.getPrivateKey(seed, 0);
    const toCamoPublicKey = bananoUtil.getAccountPublicKey(toAccount);
    return await camoBananoSend( fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos);
  };

  /**
 * sends nano funds to a camo account.
 * This function uses seed index 0 to generate the shared secret,
 * and seed index "seedIx" to get the private key that contains funds to send.
 *
 * @memberof CamoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {string_array} the sent hashes in an array.
 */
  const camoNanoSendWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const accountValid = getCamoAccountValidationInfo(toAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const fundingPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromCamoPrivateKey = bananoUtil.getPrivateKey(seed, 0);
    const toCamoPublicKey = bananoUtil.getAccountPublicKey(toAccount);
    return await camoNanoSend( fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos);
  };

  /**
   * get the pending blocks for the camo banano account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} fromAccount the account to recieve from.
   * @param {number} sharedSeedIx the index to use with the shared seed.
   * @param {number} count the max count to get.
   * @return {string_array} the pending hashes in an array.
   */
  const camoBananoGetAccountsPending = async (seed, seedIx, fromAccount, sharedSeedIx, count) => {
    const accountValid = getCamoAccountValidationInfo(fromAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const toPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromPublicKey = bananoUtil.getAccountPublicKey(fromAccount);
    return await camoUtil.getAccountsPending(bananodeApi, toPrivateKey, fromPublicKey, sharedSeedIx, count, BANANO_PREFIX);
  };

  /**
   * get the pending blocks for the camo nano account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} fromAccount the account to recieve from.
   * @param {number} sharedSeedIx the index to use with the shared seed.
   * @param {number} count the max count to get.
   * @return {string_array} the pending hashes in an array.
   */
  const camoNanoGetAccountsPending = async (seed, seedIx, fromAccount, sharedSeedIx, count) => {
    const accountValid = getCamoAccountValidationInfo(fromAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const toPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromPublicKey = bananoUtil.getAccountPublicKey(fromAccount);
    return await camoUtil.getAccountsPending(bananodeApi, toPrivateKey, fromPublicKey, sharedSeedIx, count, NANO_PREFIX);
  };

  /**
 * returns data on whether a camo account is valid or not, and why.
 * @param {string} account the account to check.
 * @return {object} the account validity data.
 */
  const getCamoAccountValidationInfo = (account) => {
    const accountValid = camoUtil.isCamoAccountValid(account);
    return accountValid;
  };

  /**
   * get the banano shared account, used as an intermediary to send finds between the seed and the camo account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @return {string} the shared account.
   */
  const getCamoBananoSharedAccountData = async (seed, seedIx, account, sharedSeedIx) => {
    const accountValid = getCamoAccountValidationInfo(account);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    return await camoUtil.getSharedAccountData(bananodeApi, privateKey, publicKey, sharedSeedIx, BANANO_PREFIX);
  };

  /**
   * get the nano shared account, used as an intermediary to send finds between the seed and the camo account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @return {string} the shared account.
   */
  const getCamoNanoSharedAccountData = async (seed, seedIx, account, sharedSeedIx) => {
    const accountValid = getCamoAccountValidationInfo(account);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    return await camoUtil.getSharedAccountData(bananodeApi, privateKey, publicKey, sharedSeedIx, NANO_PREFIX);
  };

  /**
   * Recieve banano deposits for a camo account with a given seed.
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @param {string} specificPendingBlockHash the pending block to recieve.
   * @return {string} the response from receiving the block.
   */
  const receiveCamoBananoDepositsForSeed = async (seed, seedIx, account, sharedSeedIx, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    const sharedSecret = await camoUtil.getSharedSecretFromRepresentative( bananodeApi, privateKey, publicKey, BANANO_PREFIX);
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const privateKey = bananoUtil.getPrivateKey(sharedSeed, sharedSeedIx);
      const camoPublicKey = await camoUtil.getCamoPublicKey(privateKey);
      const camoRepresentative = await camoUtil.getCamoAccount(camoPublicKey);
      const repPublicKey = await bananoUtil.getAccountPublicKey(camoRepresentative);
      const representative = await bananoUtil.getAccount(repPublicKey, BANANO_PREFIX);
      const response = await receiveBananoDepositsForSeed(sharedSeed, sharedSeedIx, representative, specificPendingBlockHash);
      return response;
    } else {
      return undefined;
    }
  };

  /**
   * Recieve nano deposits for a camo account with a given seed.
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @param {string} specificPendingBlockHash the pending block to recieve.
   * @return {string} the response from receiving the block.
   */
  const receiveCamoNanoDepositsForSeed = async (seed, seedIx, account, sharedSeedIx, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    const sharedSecret = await camoUtil.getSharedSecretFromRepresentative( bananodeApi, privateKey, publicKey, NANO_PREFIX );
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const privateKey = bananoUtil.getPrivateKey(sharedSeed, sharedSeedIx);
      const camoPublicKey = await camoUtil.getCamoPublicKey(privateKey);
      const camoRepresentative = await camoUtil.getCamoAccount(camoPublicKey);
      const repPublicKey = await bananoUtil.getAccountPublicKey(camoRepresentative);
      const representative = await bananoUtil.getAccount(repPublicKey, NANO_PREFIX);
      const response = await receiveNanoDepositsForSeed(sharedSeed, sharedSeedIx, representative, specificPendingBlockHash);
      return response;
    } else {
      return undefined;
    }
  };

  /**
   * gets the total banano account balance, in raw.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {string} the account balance, in raw.
   */
  const getCamoBananoAccountBalanceRaw = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.getBalanceRaw( bananodeApi, toPrivateKey, fromPublicKey, BANANO_PREFIX);
  };

  /**
   * gets the total nano account balance, in raw.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {string} the account balance, in raw.
   */
  const getCamoNanoAccountBalanceRaw = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.getBalanceRaw( bananodeApi, toPrivateKey, fromPublicKey, NANO_PREFIX);
  };

  /**
 * Get the network block count.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_pending}
 * @memberof BananodeApi
 * @param {string_array} accounts the array of pending accounts.
 * @param {number} count the max count to get.
 * @param {string} source if true, get source.
 * @return {object} the account's pending blocks.
 */
  const getAccountsPending = async (accounts, count, source) => {
    return await bananodeApi.getAccountsPending(accounts, count, source);
  };

  /**
   * Converts an amount into a raw amount.
   *
   * @memberof BananoUtil
   * @param {string} amountStr the amount, as a string.
   * @param {string} amountPrefix the amount, as a string.
   * @return {string} the banano as a raw value.
   */
  const getRawStrFromBananoStr = (amountStr) => {
    return bananoUtil.getRawStrFromMajorAmountStr(amountStr, BANANO_PREFIX);
  };

  /**
  * Converts an amount into a raw amount.
  *
  * @memberof BananoUtil
  * @param {string} amountStr the amount, as a string.
  * @param {string} amountPrefix the amount, as a string.
  * @return {string} the banano as a raw value.
  */
  const getRawStrFromBanoshiStr = (amountStr) => {
    return bananoUtil.getRawStrFromMinorAmountStr(amountStr, BANANO_PREFIX);
  };
    /**
     * Converts an amount into a raw amount.
     *
     * @memberof BananoUtil
     * @param {string} amountStr the amount, as a string.
     * @param {string} amountPrefix the amount, as a string.
     * @return {string} the banano as a raw value.
     */
  const getRawStrFromNanoStr = (amountStr) => {
    return bananoUtil.getRawStrFromMajorAmountStr(amountStr, NANO_PREFIX);
  };

  /**
    * Converts an amount into a raw amount.
    *
    * @memberof BananoUtil
    * @param {string} amountStr the amount, as a string.
    * @param {string} amountPrefix the amount, as a string.
    * @return {string} the banano as a raw value.
    */
  const getRawStrFromNanoshiStr = (amountStr) => {
    return bananoUtil.getRawStrFromMinorAmountStr(amountStr, NANO_PREFIX);
  };

  /**
   * Get the banano account for a given public key.
   *
   * @memberof BananoUtil
   * @param {string} publicKey the public key.
   * @return {string} the account.
   */
  const getBananoAccount = (publicKey) => {
    return bananoUtil.getAccount(publicKey, BANANO_PREFIX);
  };

  /**
    * Get the banano account for a given public key.
    *
    * @memberof BananoUtil
    * @param {string} publicKey the public key.
    * @return {string} the account.
    */
  const getNanoAccount = (publicKey) => {
    return bananoUtil.getAccount(publicKey, NANO_PREFIX);
  };

  /**
   * Get the banano parts (banano, banoshi, raw) for a given raw value.
   *
   * @memberof BananoUtil
   * @param {string} amountRawStr the raw amount, as a string.
   * @return {BananoParts} the banano parts.
   */
  const getBananoPartsFromRaw = (amountRawStr) => {
    return bananoUtil.getAmountPartsFromRaw(amountRawStr, BANANO_PREFIX);
  };

  /**
    * Get the nano parts nano, nanoshi, raw) for a given raw value.
    *
    * @memberof BananoUtil
    * @param {string} amountRawStr the raw amount, as a string.
    * @return {BananoParts} the banano parts.
    */
  const getNanoPartsFromRaw = (amountRawStr) => {
    return bananoUtil.getAmountPartsFromRaw(amountRawStr, NANO_PREFIX);
  };


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    // istanbul ignore if
    if (typeof BigInt === 'undefined') {
      return;
    }
    const exports = {};
    exports.BANANO_PREFIX = BANANO_PREFIX;
    exports.NANO_PREFIX = NANO_PREFIX;
    exports.PREFIXES = [BANANO_PREFIX, NANO_PREFIX];
    exports.sendNanoWithdrawalFromSeed = sendNanoWithdrawalFromSeed;
    exports.sendBananoWithdrawalFromSeed = sendBananoWithdrawalFromSeed;
    exports.getAccountsPending = getAccountsPending;
    exports.getBananoAccountFromSeed = getBananoAccountFromSeed;
    exports.getNanoAccountFromSeed = getNanoAccountFromSeed;
    exports.getAccountInfo = getAccountInfo;
    exports.getBlockCount = getBlockCount;

    exports.bananoUtil = bananoUtil;
    exports.bananodeApi = bananodeApi;
    exports.camoUtil = camoUtil;
    exports.depositUtil = depositUtil;
    exports.withdrawUtil = withdrawUtil;
    exports.loggingUtil = loggingUtil;

    exports.setBananodeApi = setBananodeApi;
    exports.getAccountHistory = getAccountHistory;
    exports.openBananoAccountFromSeed = openBananoAccountFromSeed;
    exports.openNanoAccountFromSeed = openNanoAccountFromSeed;
    exports.getBlockHash = getBlockHash;
    exports.getAccountBalanceRaw = getAccountBalanceRaw;
    exports.getBananoPartsFromRaw = getBananoPartsFromRaw;
    exports.getNanoPartsFromRaw = getNanoPartsFromRaw;
    exports.getPrivateKey = bananoUtil.getPrivateKey;
    exports.getPublicKey = bananoUtil.getPublicKey;
    exports.getAccount = bananoUtil.getAccount;
    exports.getNanoAccount = getNanoAccount;
    exports.getBananoAccount = getBananoAccount;
    exports.getAccountPublicKey = bananoUtil.getAccountPublicKey;
    exports.sendAmountToNanoAccount = sendAmountToNanoAccount;
    exports.sendAmountToBananoAccount = sendAmountToBananoAccount;
    exports.sendAmountToBananoAccountWithRepresentativeAndPrevious = sendAmountToBananoAccountWithRepresentativeAndPrevious;
    exports.sendAmountToNanoAccountWithRepresentativeAndPrevious = sendAmountToNanoAccountWithRepresentativeAndPrevious;
    exports.changeBananoRepresentativeForSeed = changeBananoRepresentativeForSeed;
    exports.changeNanoRepresentativeForSeed = changeNanoRepresentativeForSeed;
    exports.getSignature = getSignature;
    exports.getBytesFromHex = getBytesFromHex;
    exports.getWorkUsingCpu = getWorkUsingCpu;
    exports.getZeroedWorkBytes = bananoUtil.getZeroedWorkBytes;
    exports.isWorkValid = bananoUtil.isWorkValid;
    exports.getNanoAccountValidationInfo = bananoUtil.getNanoAccountValidationInfo;
    exports.getBananoAccountValidationInfo = bananoUtil.getBananoAccountValidationInfo;
    exports.receiveBananoDepositsForSeed = receiveBananoDepositsForSeed;
    exports.receiveNanoDepositsForSeed = receiveNanoDepositsForSeed;
    exports.getRawStrFromBananoStr = getRawStrFromBananoStr;
    exports.getRawStrFromBanoshiStr = getRawStrFromBanoshiStr;
    exports.getRawStrFromNanoStr = getRawStrFromNanoStr;
    exports.getRawStrFromNanoshiStr = getRawStrFromNanoshiStr;
    exports.setBananodeApiUrl = setBananodeApiUrl;
    exports.getCamoPublicKey = camoUtil.getCamoPublicKey;
    exports.getSharedSecret = camoUtil.getSharedSecret;
    exports.camoBananoReceive = camoBananoReceive;
    exports.camoNanoReceive = camoNanoReceive;
    exports.camoBananoSend = camoBananoSend;
    exports.camoNanoSend = camoNanoSend;
    exports.camoBananoSendWithdrawalFromSeed = camoBananoSendWithdrawalFromSeed;
    exports.camoNanoSendWithdrawalFromSeed = camoNanoSendWithdrawalFromSeed;
    exports.getCamoAccount = camoUtil.getCamoAccount;
    exports.getCamoBananoAccountBalanceRaw = getCamoBananoAccountBalanceRaw;
    exports.getCamoNanoAccountBalanceRaw = getCamoNanoAccountBalanceRaw;
    exports.getCamoBananoNextPrivateKeyForReceive = getCamoBananoNextPrivateKeyForReceive;
    exports.getCamoNanoNextPrivateKeyForReceive = getCamoNanoNextPrivateKeyForReceive;
    exports.camoBananoGetAccountsPending = camoBananoGetAccountsPending;
    exports.camoNanoGetAccountsPending = camoNanoGetAccountsPending;
    exports.getCamoBananoSharedAccountData = getCamoBananoSharedAccountData;
    exports.getCamoNanoSharedAccountData = getCamoNanoSharedAccountData;
    exports.receiveCamoBananoDepositsForSeed = receiveCamoBananoDepositsForSeed;
    exports.receiveCamoNanoDepositsForSeed = receiveCamoNanoDepositsForSeed;
    exports.getCamoAccountValidationInfo = getCamoAccountValidationInfo;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoinBananojs = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
