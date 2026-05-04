import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { http, createPublicClient, PublicClient } from 'viem';
import { SupportedChainIds, ChainId } from '@frankencoin/zchf';
import { arbitrum, avalanche, base, gnosis, mainnet, optimism, polygon, sonic } from 'viem/chains';

import * as dotenv from 'dotenv';
dotenv.config();

// Config type
export type ConfigType = {
	app: string;
	indexer: string;
	backupIndexer: string | null;
	coingeckoApiKey: string;
	alchemyRpcKey: string;
	theGraphKey: string;
	supportedChainIds: ChainId[];
	databaseEnabled: boolean;
};

// Create config
export const CONFIG: ConfigType = {
	app: process.env.CONFIG_APP_URL || 'https://app.frankencoin.com',
	indexer: process.env.CONFIG_INDEXER_URL || 'https://ponder.frankencoin.com',
	backupIndexer: process.env.CONFIG_BACKUP_INDEXER_URL || null,
	coingeckoApiKey: process.env.COINGECKO_API_KEY || '',
	alchemyRpcKey: process.env.ALCHEMY_RPC_KEY || '',
	theGraphKey: process.env.THE_GRAPH_KEY || '',
	supportedChainIds: SupportedChainIds,
	databaseEnabled: process.env.DISABLE_DATABASE !== 'true',
};

// Start up message
console.log(`Starting API with this config:`);
console.log(CONFIG);

// PONDER CLIENT REQUEST (Primary Indexer)
export const PONDER_CLIENT = new ApolloClient({
	uri: CONFIG.indexer,
	cache: new InMemoryCache(),
});

// PONDER CLIENT BACKUP (Backup Indexer)
export const PONDER_CLIENT_BACKUP = CONFIG.backupIndexer
	? new ApolloClient({
			uri: CONFIG.backupIndexer,
			cache: new InMemoryCache(),
		})
	: null;

// Free public RPC URLs
const RPC_MAINNET   = process.env.RPC_URL_MAINNET  || 'https://cloudflare-eth.com';
const RPC_POLYGON   = process.env.RPC_URL_POLYGON  || 'https://polygon.publicnode.com';
const RPC_OPTIMISM  = process.env.RPC_URL_OPTIMISM || 'https://optimism.publicnode.com';
const RPC_ARBITRUM  = process.env.RPC_URL_ARBITRUM || 'https://arbitrum-one.publicnode.com';
const RPC_BASE      = process.env.RPC_URL_BASE     || 'https://base.publicnode.com';
const RPC_AVALANCHE = process.env.RPC_URL_AVALANCHE|| 'https://avalanche-c-chain.publicnode.com';
const RPC_GNOSIS    = process.env.RPC_URL_GNOSIS   || 'https://gnosis.publicnode.com';
const RPC_SONIC     = process.env.RPC_URL_SONIC    || 'https://rpc.soniclabs.com';

// VIEM CONFIG BY CHAINS
export const ViemConfigMainnet = createPublicClient({
	chain: mainnet,
	transport: http(RPC_MAINNET),
	batch: { multicall: { wait: 200 } },
});

export const ViemConfigPolygon = createPublicClient({
	chain: polygon,
	transport: http(RPC_POLYGON),
	batch: { multicall: { wait: 200 } },
});

export const ViemConfigOptimism = createPublicClient({
	chain: optimism,
	transport: http(RPC_OPTIMISM),
	batch: { multicall: { wait: 200 } },
});

export const ViemConfigArbitrum = createPublicClient({
	chain: arbitrum,
	transport: http(RPC_ARBITRUM),
	batch: { multicall: { wait: 200 } },
});

export const ViemConfigBase = createPublicClient({
	chain: base,
	transport: http(RPC_BASE),
	batch: { multicall: { wait: 200 } },
});

export const ViemConfigAvalanche = createPublicClient({
	chain: avalanche,
	transport: http(RPC_AVALANCHE),
	batch: { multicall: { wait: 200 } },
});

export const ViemConfigGnosis = createPublicClient({
	chain: gnosis,
	transport: http(RPC_GNOSIS),
	batch: { multicall: { wait: 200 } },
});

export const ViemConfigSonic = createPublicClient({
	chain: sonic,
	transport: http(RPC_SONIC),
	batch: { multicall: { wait: 200 } },
});

// VIEM CONFIG MERGED
export const VIEM_CONFIG: Record<number, PublicClient> = {
	[mainnet.id]: ViemConfigMainnet as PublicClient,
	[polygon.id]: ViemConfigPolygon as PublicClient,
	[optimism.id]: ViemConfigOptimism as PublicClient,
	[arbitrum.id]: ViemConfigArbitrum as PublicClient,
	[base.id]: ViemConfigBase as PublicClient,
	[avalanche.id]: ViemConfigAvalanche as PublicClient,
	[gnosis.id]: ViemConfigGnosis as PublicClient,
	[sonic.id]: ViemConfigSonic as PublicClient,
} as const;

// COINGECKO CLIENT
export const COINGECKO_CLIENT = (query: string) => {
	const hasParams = query.includes('?');
	const uri: string = `https://api.coingecko.com${query}`;
	return fetch(`${uri}${hasParams ? '&' : '?'}${CONFIG.coingeckoApiKey}`);
};
