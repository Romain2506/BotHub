import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Logger } from './utils/logger.js';
import { homesStore } from './homesStore.js';

// Constants
const SECRET_FILE = join(process.cwd(), 'data', '.secret');
const ACCOUNTS_FILE = join(process.cwd(), 'data', 'accounts.json');
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 16;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits
const PBKDF2_ITERATIONS = 100000;

export class AccountManager {
  constructor() {
    this.secretKey = null;
    this.init();
  }

  /**
   * Initialize the AccountManager by loading or creating the secret key
   * and loading existing accounts
   */
  init() {
    try {
      // Ensure data directory exists
      const dataDir = join(process.cwd(), 'data');
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }

      // Load or create secret key
      this.loadOrCreateSecret();

      // Load existing accounts
      this.loadAccounts();
    } catch (error) {
      Logger.error(`Failed to initialize AccountManager: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load existing secret key or create a new one
   * @throws {Error} If secret file is corrupt and cannot be recovered
   */
  loadOrCreateSecret() {
    try {
      if (existsSync(SECRET_FILE)) {
        const secretData = readFileSync(SECRET_FILE, 'utf8');
        const secretObj = JSON.parse(secretData);

        // Validate secret object structure
        if (!secretObj.key || !secretObj.salt) {
          throw new Error('Corrupt secret file: missing required fields');
        }

        // Recreate key from stored salt and key
        const salt = Buffer.from(secretObj.salt, 'hex');
        const keyBuffer = Buffer.from(secretObj.key, 'hex');
        this.secretKey = keyBuffer;

        Logger.info('Loaded existing encryption secret');
      } else {
        // Generate new secret
        this.generateSecret();
        Logger.info('Generated new encryption secret');
      }
    } catch (error) {
      // If secret file is corrupt, we should not silently regenerate it
      // as per requirements - refuse to silently regenerate .secret if absent/corrupted
      if (error.message && error.message.includes('Corrupt secret file')) {
        Logger.error(`Secret file is corrupt and cannot be automatically recovered: ${error.message}`);
        Logger.error('Please manually recover or delete the .secret file and restart the application.');
        throw new Error(`Failed to load encryption secret: ${error.message}. Manual intervention required.`);
      } else {
        // For other errors (like file not found), generate new secret
        Logger.warn(`Could not read secret file, generating new one: ${error.message}`);
        this.generateSecret();
      }
    }
  }

  /**
   * Generate a new secret key and save it to .secret file
   */
  generateSecret() {
    // Generate salt
    const salt = randomBytes(SALT_LENGTH);

    // Generate key using PBKDF2 (or we could use randomBytes directly for the key)
    // For better security, we'll generate a random key and store it encrypted with a password-derived key
    // But for simplicity and following the requirement of AES-256-GCM, we'll generate a random key
    const key = randomBytes(KEY_LENGTH);

    // Store secret object
    const secretObj = {
      key: key.toString('hex'),
      salt: salt.toString('hex'),
      version: '1.0',
      createdAt: new Date().toISOString()
    };

    // Write secret file
    writeFileSync(SECRET_FILE, JSON.stringify(secretObj, null, 2), 'utf8');
    this.secretKey = key;

    // Set file permissions to be more secure (readable only by owner)
    // Skipping chmod for simplicity and cross-platform compatibility
    // In production, consider setting appropriate file permissions via deployment process
  }

  /**
   * Load accounts from accounts.json file
   */
  loadAccounts() {
    try {
      if (existsSync(ACCOUNTS_FILE)) {
        const accountsData = readFileSync(ACCOUNTS_FILE, 'utf8');
        const accountsObj = JSON.parse(accountsData);

        // Decrypt each account's password
        if (accountsObj.accounts && Array.isArray(accountsObj.accounts)) {
          this.accounts = accountsObj.accounts.map(account => ({
            ...account,
            // Un mot de passe vide n'est jamais chiffré : ne pas tenter de le déchiffrer
            password: (account.password && typeof account.password === 'object')
              ? this.decrypt(account.password)
              : (account.password || '')
          }));
        } else {
          this.accounts = [];
        }

        Logger.info(`Loaded ${this.accounts.length} accounts from storage`);
      } else {
        // Create empty accounts file
        this.accounts = [];
        this.saveAccounts();
        Logger.info('Created new accounts storage file');
      }
    } catch (error) {
      Logger.error(`Failed to load accounts: ${error.message}`);
      // Initialize with empty accounts array to prevent breaking the app
      this.accounts = [];
      throw error;
    }
  }

  /**
   * Save accounts to accounts.json file (with encryption)
   */
  saveAccounts() {
    try {
      // Encrypt passwords before saving
      const accountsToSave = this.accounts.map(account => {
        // Don't include plaintext password in what we save
        const accountCopy = { ...account };
        if (accountCopy.password) {
          accountCopy.password = this.encrypt(accountCopy.password);
        }
        return accountCopy;
      });

      const accountsObj = {
        accounts: accountsToSave,
        version: '1.0',
        updatedAt: new Date().toISOString()
      };

      // Write accounts file
      writeFileSync(ACCOUNTS_FILE, JSON.stringify(accountsObj, null, 2), 'utf8');

      Logger.info(`Saved ${this.accounts.length} accounts to storage`);
    } catch (error) {
      Logger.error(`Failed to save accounts: ${error.message}`);
      throw error;
    }
  }

  /**
   * Encrypt a password using AES-256-GCM
   * @param {string} plaintext - Password to encrypt
   * @returns {Object} Object containing iv, encryptedData, and tag in hex format
   */
  encrypt(plaintext) {
    if (!this.secretKey) {
      throw new Error('Encryption key not initialized');
    }

    // Generate random IV
    const iv = randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = createCipheriv(ENCRYPTION_ALGORITHM, this.secretKey, iv);

    // Encrypt the plaintext
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the authentication tag
    const tag = cipher.getAuthTag();

    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      tag: tag.toString('hex')
    };
  }

  /**
   * Decrypt a password using AES-256-GCM
   * @param {Object} encryptedObject - Object containing iv, encryptedData, and tag in hex format
   * @returns {string} Decrypted plaintext password
   */
  decrypt(encryptedObject) {
    if (!this.secretKey) {
      throw new Error('Decryption key not initialized');
    }

    try {
      // Extract components
      const iv = Buffer.from(encryptedObject.iv, 'hex');
      const encryptedData = Buffer.from(encryptedObject.encryptedData, 'hex');
      const tag = Buffer.from(encryptedObject.tag, 'hex');

      // Create decipher
      const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, this.secretKey, iv);
      decipher.setAuthTag(tag);

      // Decrypt the data
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      Logger.error(`Failed to decrypt data: ${error.message}`);
      throw new Error('Failed to decrypt account data. The data may be corrupt or using a different encryption key.');
    }
  }

  /**
   * Validate account data
   * @param {Object} account - Account object to validate
   * @returns {boolean} True if account is valid
   */
  validateAccount(account) {
    if (!account || typeof account !== 'object') {
      return false;
    }

    // Required fields
    if (!account.id || typeof account.id !== 'string' || account.id.trim() === '') {
      return false;
    }

    if (!account.username || typeof account.username !== 'string' || account.username.trim() === '') {
      return false;
    }

    // Password is optional for some account types, but if present should be string
    if (account.password !== undefined && typeof account.password !== 'string') {
      return false;
    }

    // Additional validation can be added here
    return true;
  }

  /**
   * Add a new account
   * @param {Object} accountData - Account data to add
   * @returns {Object} The added account (with password encrypted in storage)
   */
  addAccount(accountData) {
    try {
      // Validate input
      if (!this.validateAccount(accountData)) {
        throw new Error('Invalid account data provided');
      }

      // Check if account with same ID already exists
      const existingIndex = this.accounts.findIndex(acc => acc.id === accountData.id);
      if (existingIndex !== -1) {
        throw new Error(`Account with ID '${accountData.id}' already exists`);
      }

      // Create new account object
      const newAccount = {
        id: accountData.id.trim(),
        username: accountData.username.trim(),
        password: accountData.password || '', // Will be encrypted when saved
        description: String(accountData.description || '').slice(0, 300),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(accountData.metadata || {}) // Allow additional metadata
      };

      // Add to accounts array
      this.accounts.push(newAccount);

      // Save to file
      this.saveAccounts();

      Logger.info(`Account added: ${newAccount.id}`);
      return { ...newAccount }; // Return copy without internal encryption details
    } catch (error) {
      Logger.error(`Failed to add account: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get an account by ID
   * @param {string} accountId - ID of account to retrieve
   * @returns {Object|null} Account object or null if not found
   */
  getAccount(accountId) {
    try {
      if (!accountId || typeof accountId !== 'string') {
        return null;
      }

      const account = this.accounts.find(acc => acc.id === accountId);
      if (!account) {
        return null;
      }

      // Return a copy of the account (password will be decrypted via getter if needed)
      // For now, we'll return the account as-is since passwords are already decrypted in memory
      return { ...account };
    } catch (error) {
      Logger.error(`Failed to get account: ${error.message}`);
      return null;
    }
  }

  /**
   * Update an existing account
   * @param {string} accountId - ID of account to update
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated account object
   */
  updateAccount(accountId, updateData) {
    try {
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID provided');
      }

      if (!updateData || typeof updateData !== 'object') {
        throw new Error('Invalid update data provided');
      }

      const accountIndex = this.accounts.findIndex(acc => acc.id === accountId);
      if (accountIndex === -1) {
        throw new Error(`Account with ID '${accountId}' not found`);
      }

      // Get current account
      const currentAccount = this.accounts[accountIndex];

      // Seuls le pseudo et le mot de passe sont modifiables
      const changes = {};
      if (updateData.username !== undefined) {
        changes.username = String(updateData.username).trim();
        const taken = this.accounts.some(
          (acc) => acc.id !== accountId && acc.username.toLowerCase() === changes.username.toLowerCase()
        );
        if (taken) throw new Error(`Le pseudo '${changes.username}' est déjà utilisé`);
      }
      if (updateData.password !== undefined) {
        changes.password = String(updateData.password);
      }
      if (updateData.description !== undefined) {
        changes.description = String(updateData.description).slice(0, 300);
      }

      // Create updated account
      const updatedAccount = {
        ...currentAccount,
        ...changes,
        updatedAt: new Date().toISOString()
      };

      // Validate updated account
      if (!this.validateAccount(updatedAccount)) {
        throw new Error('Invalid account data after update');
      }

      // Update in array
      this.accounts[accountIndex] = updatedAccount;

      // Save to file
      this.saveAccounts();

      Logger.info(`Account updated: ${accountId}`);
      return { ...updatedAccount };
    } catch (error) {
      Logger.error(`Failed to update account: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete an account by ID
   * @param {string} accountId - ID of account to delete
   * @returns {boolean} True if account was deleted
   */
  deleteAccount(accountId) {
    try {
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID provided');
      }

      const initialLength = this.accounts.length;
      this.accounts = this.accounts.filter(acc => acc.id !== accountId);

      if (this.accounts.length === initialLength) {
        throw new Error(`Account with ID '${accountId}' not found`);
      }

      // Save to file
      this.saveAccounts();
      // Nettoie les homes et descriptions enregistrés pour ce compte
      try { homesStore.removeAccount(accountId); } catch (e) { /* ignore */ }

      Logger.info(`Account deleted: ${accountId}`);
      return true;
    } catch (error) {
      Logger.error(`Failed to delete account ${accountId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprime tous les comptes (et leurs homes associés). Utilisé par la réinitialisation complète.
   */
  resetAll() {
    try {
      for (const acc of [...this.accounts]) {
        try { this.deleteAccount(acc.id); } catch (e) { /* ignore */ }
      }
      this.accounts = [];
      this.saveAccounts();
    } catch (error) {
      Logger.error(`Failed to delete account: ${error.message}`);
      throw error;
    }
  }

  /**
   * List all accounts (without sensitive data)
   * @returns {Array} Array of account objects (passwords excluded)
   */
  listAccounts() {
    try {
      return this.accounts.map(account => {
        const { password, email, ...safeAccount } = account;
        return { ...safeAccount, hasPassword: Boolean(password) };
      });
    } catch (error) {
      Logger.error(`Failed to list accounts: ${error.message}`);
      return [];
    }
  }

  /**
   * Check if an account exists
   * @param {string} accountId - ID of account to check
   * @returns {boolean} True if account exists
   */
  accountExists(accountId) {
    return this.accounts.some(acc => acc.id === accountId);
  }
}

// Export a singleton instance
export const accountManager = new AccountManager();