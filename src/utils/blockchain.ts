import CryptoJS from 'crypto-js';
import { Block, Vote } from '../types/blockchain';

export class Blockchain {
  private chain: Block[] = [];
  private difficulty: number = 4;

  constructor() {
    // Create genesis block
    this.createBlock({
      voterId: '0',
      candidateId: '0',
      timestamp: Date.now(),
    });
  }

  private calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    vote: Vote,
    nonce: number
  ): string {
    return CryptoJS.SHA256(
      index + previousHash + timestamp + JSON.stringify(vote) + nonce
    ).toString();
  }

  private getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  createBlock(vote: Vote): Block {
    const previousBlock = this.getLatestBlock();
    const newIndex = previousBlock ? previousBlock.index + 1 : 0;
    const previousHash = previousBlock ? previousBlock.hash : '0';
    
    let nonce = 0;
    let timestamp = Date.now();
    let hash = this.calculateHash(newIndex, previousHash, timestamp, vote, nonce);

    // Proof of work
    while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      nonce++;
      hash = this.calculateHash(newIndex, previousHash, timestamp, vote, nonce);
    }

    const newBlock: Block = {
      index: newIndex,
      timestamp,
      vote,
      previousHash,
      hash,
      nonce,
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  loadChain(blocks: Block[]) {
    this.chain = blocks;
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify hash
      if (currentBlock.hash !== this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.vote,
        currentBlock.nonce
      )) {
        return false;
      }

      // Verify chain link
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getChain(): Block[] {
    return this.chain;
  }
}