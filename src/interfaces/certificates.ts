export interface Account {
    address: string;
}

export interface Contract {
    alias: string;
    address: string;
}

export interface Format {
    uri: string;
    mimeType: string;
}

export interface Metadata {
    name: string;
    tags: string[];
    symbol: string;
    formats: Format[];
    creators: string[];
    decimals: string;
    displayUri: string;
    artifactUri: string;
    description: string;
    thumbnailUri: string;
    isBooleanAmount: boolean;
    shouldPreferSymbol: boolean;
}

export interface Token {
    id: number;
    contract: Contract;
    tokenId: string;
    standard: string;
    metadata: Metadata;
}

export interface CertificateNFTS {
    id: number;
    account: Account;
    token: Token;
    balance: string;
    transfersCount: number;
    firstLevel: number;
    firstTime: Date;
    lastLevel: number;
    lastTime: Date;
}