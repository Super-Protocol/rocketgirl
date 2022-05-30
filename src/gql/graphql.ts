import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@/apollo/hooks';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type BaseOrder = {
  __typename?: 'BaseOrder';
  /** system identifier */
  _id: Scalars['String'];
  /** contract address */
  address: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  consumer: Scalars['String'];
  depositSpent?: Maybe<Scalars['String']>;
  offerInfo?: Maybe<OfferInfo>;
  offerType: TOfferType;
  orderHoldDeposit?: Maybe<Scalars['Float']>;
  orderInfo: OrderInfo;
  orderResult: OrderResult;
  origins?: Maybe<Origins>;
  teeOfferInfo?: Maybe<TeeOfferInfo>;
};

export type BaseOrderInputType = {
  consumer: Scalars['String'];
  depositSpent?: InputMaybe<Scalars['String']>;
  offerInfo?: InputMaybe<OfferInfoInput>;
  offerType: TOfferType;
  orderHoldDeposit?: InputMaybe<Scalars['Float']>;
  orderInfo: OrderInfoInput;
  orderResult: OrderResultInput;
  teeOfferInfo?: InputMaybe<TeeOfferInfoInput>;
};

export type Config = {
  __typename?: 'Config';
  /** system identifier */
  _id: Scalars['String'];
  name: Scalars['String'];
  value: ValueObject;
};

export type ConfigConnection = {
  __typename?: 'ConfigConnection';
  edges?: Maybe<Array<ConfigEdge>>;
  pageInfo?: Maybe<ConfigPageInfo>;
};

export type ConfigEdge = {
  __typename?: 'ConfigEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Config>;
};

export type ConfigFilter = {
  /** filter by config name */
  name?: InputMaybe<Scalars['String']>;
};

export type ConfigInputType = {
  /** system identifier */
  _id: Scalars['String'];
  name: Scalars['String'];
  value: ValueObjectType;
};

export type ConfigPageInfo = {
  __typename?: 'ConfigPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type ConnectionArgs = {
  /** Paginate after opaque cursor */
  after?: InputMaybe<Scalars['String']>;
  /** Paginate before opaque cursor */
  before?: InputMaybe<Scalars['String']>;
  /** Paginate first */
  first?: InputMaybe<Scalars['Float']>;
  /** Paginate last */
  last?: InputMaybe<Scalars['Float']>;
  /** sort field name */
  sortBy?: InputMaybe<Scalars['String']>;
  /** sort directory - ASC or DESC. Default value DESC */
  sortDir?: InputMaybe<Scalars['String']>;
};

export type CreateProviderInput = {
  /** provider contract address */
  address: Scalars['String'];
  authority?: InputMaybe<Scalars['String']>;
  availableDeposit?: InputMaybe<Scalars['Float']>;
  origins?: InputMaybe<OriginsInput>;
  providerInfo: ProviderInfoInput;
  teeOffers?: InputMaybe<Array<Scalars['String']>>;
  valueOffers?: InputMaybe<Array<Scalars['String']>>;
};

export type Erc20 = {
  __typename?: 'Erc20';
  /** system identifier */
  _id: Scalars['String'];
  balance?: Maybe<Scalars['Float']>;
  netBalance: Scalars['String'];
  /** owner address */
  owner: Scalars['String'];
};

export type Erc20Connection = {
  __typename?: 'Erc20Connection';
  edges?: Maybe<Array<Erc20Edge>>;
  pageInfo?: Maybe<Erc20PageInfo>;
};

export type Erc20Edge = {
  __typename?: 'Erc20Edge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Erc20>;
};

export type Erc20InputType = {
  /** system identifier */
  _id: Scalars['String'];
  balance?: InputMaybe<Scalars['Float']>;
  netBalance: Scalars['String'];
  /** owner address */
  owner: Scalars['String'];
};

export type Erc20PageInfo = {
  __typename?: 'Erc20PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Erc20rFilter = {
  /** filter by owner address */
  owner?: InputMaybe<Scalars['String']>;
};

export type ListConfigResponse = {
  __typename?: 'ListConfigResponse';
  page: ConfigConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListErc20Response = {
  __typename?: 'ListErc20Response';
  page: Erc20Connection;
  pageData?: Maybe<PageDataDto>;
};

export type ListLockingResponse = {
  __typename?: 'ListLockingResponse';
  page: LockingConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListOffersResponse = {
  __typename?: 'ListOffersResponse';
  page: OfferConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListOrdersResponse = {
  __typename?: 'ListOrdersResponse';
  page: OrderConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListProvidersResponse = {
  __typename?: 'ListProvidersResponse';
  page: ProviderConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListStakingResponse = {
  __typename?: 'ListStakingResponse';
  page: StakingConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListTeeOffersResponse = {
  __typename?: 'ListTeeOffersResponse';
  page: TeeOfferConnection;
  pageData?: Maybe<PageDataDto>;
};

export type LockInfo = {
  __typename?: 'LockInfo';
  amount: Scalars['Float'];
  contract: TLockInfoSource;
  fromDate: Scalars['Float'];
  toDate: Scalars['Float'];
};

export type LockInfoInput = {
  amount: Scalars['Float'];
  contract: TLockInfoSource;
  fromDate: Scalars['Float'];
  toDate: Scalars['Float'];
};

export type Locking = {
  __typename?: 'Locking';
  /** system identifier */
  _id: Scalars['String'];
  lockInfo: LockInfo;
  /** owner address */
  owner: Scalars['String'];
};

export type LockingConnection = {
  __typename?: 'LockingConnection';
  edges?: Maybe<Array<LockingEdge>>;
  pageInfo?: Maybe<LockingPageInfo>;
};

export type LockingEdge = {
  __typename?: 'LockingEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Locking>;
};

export type LockingFilter = {
  /** filter by owner address */
  owner?: InputMaybe<Scalars['String']>;
};

export type LockingInputType = {
  /** system identifier */
  _id: Scalars['String'];
  lockInfo: LockInfoInput;
  /** owner address */
  owner: Scalars['String'];
};

export type LockingPageInfo = {
  __typename?: 'LockingPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type MockSchemaExample = {
  __typename?: 'MockSchemaExample';
  id?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProvider: Provider;
  removeConfig: Config;
  removeOffer: TeeOffer;
  removeProvider: Provider;
  /** Transfers specific amount of SP tokens to specific address */
  transfer: Scalars['String'];
  updateConfig: Config;
  updateOffer: TeeOffer;
  updateProvider: Provider;
};


export type MutationCreateProviderArgs = {
  createProviderInput: CreateProviderInput;
};


export type MutationRemoveConfigArgs = {
  _id: Scalars['String'];
};


export type MutationRemoveOfferArgs = {
  _id: Scalars['String'];
};


export type MutationRemoveProviderArgs = {
  _id: Scalars['String'];
};


export type MutationTransferArgs = {
  transfer: TransferInputType;
};


export type MutationUpdateConfigArgs = {
  updateConfigInput: UpdateConfigInput;
};


export type MutationUpdateOfferArgs = {
  updateTeeOfferInput: UpdateTeeOfferInput;
};


export type MutationUpdateProviderArgs = {
  updateProviderInput: UpdateProviderInput;
};

export type Offer = {
  __typename?: 'Offer';
  /** system identifier */
  _id: Scalars['String'];
  /** contract address */
  address: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  offerInfo: OfferInfo;
  origins?: Maybe<Origins>;
  providerInfo: ProviderInformation;
  stats?: Maybe<OfferStats>;
};

export type OfferConnection = {
  __typename?: 'OfferConnection';
  edges?: Maybe<Array<OfferEdge>>;
  pageInfo?: Maybe<OfferPageInfo>;
};

export type OfferEdge = {
  __typename?: 'OfferEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Offer>;
};

export type OfferFilter = {
  /** filter by contract address */
  address?: InputMaybe<Scalars['String']>;
  /** filter by contract addresses */
  addresses?: InputMaybe<Array<Scalars['String']>>;
  /** filter by offerInfo → group */
  group?: InputMaybe<Scalars['String']>;
  /** filter by offerInfo → name */
  name?: InputMaybe<Scalars['String']>;
  /** filter by offerInfo -> type */
  offerType?: InputMaybe<TOfferType>;
  /** filter by offerInfo -> restrictions -> offers */
  restrictions?: InputMaybe<Array<Scalars['String']>>;
};

export type OfferInfo = {
  __typename?: 'OfferInfo';
  allowedAccounts?: Maybe<Array<Scalars['String']>>;
  allowedArgs?: Maybe<Scalars['String']>;
  argsPublicKey: Scalars['String'];
  cancelable: Scalars['Boolean'];
  description: Scalars['String'];
  disabledAfter: Scalars['Float'];
  /**
   * The supported offers group.
   *
   *   TeeOffer = '0',
   *
   *   Storage = '1',
   *
   *   Solution = '2',
   *
   *   Data = '3'
   *
   */
  group: Scalars['String'];
  hash: Scalars['String'];
  holdSum: Scalars['Float'];
  inputFormat: Scalars['String'];
  linkage: Scalars['String'];
  maxDurationTimeMinutes: Scalars['Float'];
  name: Scalars['String'];
  /**
   * The supported offers type.
   *
   *      0 - Input,
   *
   *      1 - Output
   *
   */
  offerType: Scalars['String'];
  outputFormat: Scalars['String'];
  properties: Scalars['String'];
  restrictions?: Maybe<OfferRestrictions>;
  resultUrl: Scalars['String'];
};

export type OfferInfoInput = {
  allowedAccounts?: InputMaybe<Array<Scalars['String']>>;
  allowedArgs?: InputMaybe<Scalars['String']>;
  argsPublicKey: Scalars['String'];
  cancelable: Scalars['Boolean'];
  description: Scalars['String'];
  disabledAfter: Scalars['Float'];
  /**
   * The supported offers group.
   *
   *   TeeOffer = '0',
   *
   *   Storage = '1',
   *
   *   Solution = '2',
   *
   *   Data = '3'
   *
   */
  group: Scalars['String'];
  hash: Scalars['String'];
  holdSum: Scalars['Float'];
  inputFormat: Scalars['String'];
  linkage: Scalars['String'];
  maxDurationTimeMinutes: Scalars['Float'];
  name: Scalars['String'];
  /**
   * The supported offers type.
   *
   *      0 - Input,
   *
   *      1 - Output
   *
   */
  offerType: Scalars['String'];
  outputFormat: Scalars['String'];
  properties: Scalars['String'];
  restrictions?: InputMaybe<OfferRestrictionsInput>;
  resultUrl: Scalars['String'];
};

export type OfferInputType = {
  offerInfo: OfferInfoInput;
  providerInfo: ProviderInformationInput;
  stats?: InputMaybe<OfferStatsInput>;
};

export type OfferPageInfo = {
  __typename?: 'OfferPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type OfferRestrictions = {
  __typename?: 'OfferRestrictions';
  offers?: Maybe<Array<Scalars['String']>>;
  types?: Maybe<Array<TOfferType>>;
};

export type OfferRestrictionsInput = {
  offers?: InputMaybe<Array<Scalars['String']>>;
  types?: InputMaybe<Array<TOfferType>>;
};

export type OfferStats = {
  __typename?: 'OfferStats';
  ordersInQueue: Scalars['Float'];
};

export type OfferStatsInput = {
  ordersInQueue: Scalars['Float'];
};

export type Order = {
  __typename?: 'Order';
  /** system identifier */
  _id: Scalars['String'];
  /** contract address */
  address: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  consumer: Scalars['String'];
  depositSpent?: Maybe<Scalars['String']>;
  offerInfo?: Maybe<OfferInfo>;
  offerType: TOfferType;
  orderHoldDeposit?: Maybe<Scalars['Float']>;
  orderInfo: OrderInfo;
  orderResult: OrderResult;
  origins?: Maybe<Origins>;
  parentOrder?: Maybe<ParentOrder>;
  subOrders?: Maybe<Array<BaseOrder>>;
  teeOfferInfo?: Maybe<TeeOfferInfo>;
};

export type OrderArgs = {
  __typename?: 'OrderArgs';
  inputOffers?: Maybe<Array<Scalars['String']>>;
  selectedOffers?: Maybe<Array<Scalars['String']>>;
  slots?: Maybe<Scalars['Float']>;
};

export type OrderArgsInput = {
  inputOffers?: InputMaybe<Array<Scalars['String']>>;
  selectedOffers?: InputMaybe<Array<Scalars['String']>>;
  slots?: InputMaybe<Scalars['Float']>;
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  edges?: Maybe<Array<OrderEdge>>;
  pageInfo?: Maybe<OrderPageInfo>;
};

export type OrderEdge = {
  __typename?: 'OrderEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Order>;
};

export type OrderInfo = {
  __typename?: 'OrderInfo';
  args: OrderArgs;
  encryptedArgs: Scalars['String'];
  encryptedRequirements: Scalars['String'];
  offer: Scalars['String'];
  resultPublicKey: Scalars['String'];
  /**
   * description of values:
   * 
   *     New = '0',
   *
   *     Processing = '1',
   *
   *     Canceling = '2',
   *
   *     Canceled = '3',
   *
   *     Done = '4',
   *
   *     Error = '5',
   *
   *     Blocked = '6',
   *
   *     Suspended = '7',
   *
   *     AwaitingPayment = '8'
   *
   *
   */
  status: Scalars['String'];
};

export type OrderInfoInput = {
  args: OrderArgsInput;
  encryptedArgs: Scalars['String'];
  encryptedRequirements: Scalars['String'];
  offer: Scalars['String'];
  resultPublicKey: Scalars['String'];
  /**
   * description of values:
   * 
   *     New = '0',
   *
   *     Processing = '1',
   *
   *     Canceling = '2',
   *
   *     Canceled = '3',
   *
   *     Done = '4',
   *
   *     Error = '5',
   *
   *     Blocked = '6',
   *
   *     Suspended = '7',
   *
   *     AwaitingPayment = '8'
   *
   *
   */
  status: Scalars['String'];
};

export type OrderInputType = {
  consumer: Scalars['String'];
  depositSpent?: InputMaybe<Scalars['String']>;
  offerInfo?: InputMaybe<OfferInfoInput>;
  offerType: TOfferType;
  orderHoldDeposit?: InputMaybe<Scalars['Float']>;
  orderInfo: OrderInfoInput;
  orderResult: OrderResultInput;
  parentOrder?: InputMaybe<ParentOrderInputType>;
  subOrders?: InputMaybe<Array<BaseOrderInputType>>;
  teeOfferInfo?: InputMaybe<TeeOfferInfoInput>;
};

export type OrderPageInfo = {
  __typename?: 'OrderPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type OrderResult = {
  __typename?: 'OrderResult';
  encryptedError?: Maybe<Scalars['String']>;
  encryptedResult?: Maybe<Scalars['String']>;
  orderPrice?: Maybe<Scalars['Float']>;
};

export type OrderResultInput = {
  encryptedError?: InputMaybe<Scalars['String']>;
  encryptedResult?: InputMaybe<Scalars['String']>;
  orderPrice?: InputMaybe<Scalars['Float']>;
};

export type OrdersFilter = {
  /** filter by contract address */
  address?: InputMaybe<Scalars['String']>;
  /** filter by orderInfo -> consumer */
  consumer?: InputMaybe<Scalars['String']>;
  /** filter by orderInfo -> args -> inputOffers */
  inputOffers?: InputMaybe<Array<Scalars['String']>>;
  /** filter by parentOrder->orderAddress */
  parentOrder?: InputMaybe<Scalars['String']>;
  /** filter by orderInfo -> args -> selectedOffers */
  selectedOffers?: InputMaybe<Array<Scalars['String']>>;
  /** filter by orderInfo -> status */
  status?: InputMaybe<Scalars['String']>;
};

export type Origins = {
  __typename?: 'Origins';
  createdBy: Scalars['String'];
  createdDate: Scalars['Float'];
  modifiedBy: Scalars['String'];
  modifiedDate: Scalars['Float'];
};

export type OriginsInput = {
  createdBy: Scalars['String'];
  createdDate: Scalars['Float'];
  modifiedBy: Scalars['String'];
  modifiedDate: Scalars['Float'];
};

export type PageDataDto = {
  __typename?: 'PageDataDto';
  /** total number of documents */
  count: Scalars['Float'];
  /** selection limit */
  limit: Scalars['Float'];
  /** selection offset */
  offset: Scalars['Float'];
};

export type ParentOrder = {
  __typename?: 'ParentOrder';
  /** system identifier */
  _id: Scalars['String'];
  /** contract address */
  address: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  consumer: Scalars['String'];
  depositSpent?: Maybe<Scalars['String']>;
  offerInfo?: Maybe<OfferInfo>;
  offerType: TOfferType;
  orderHoldDeposit?: Maybe<Scalars['Float']>;
  orderInfo: OrderInfo;
  orderResult: OrderResult;
  origins?: Maybe<Origins>;
  parentOrder?: Maybe<Scalars['String']>;
  teeOfferInfo?: Maybe<TeeOfferInfo>;
};

export type ParentOrderInputType = {
  consumer: Scalars['String'];
  depositSpent?: InputMaybe<Scalars['String']>;
  offerInfo?: InputMaybe<OfferInfoInput>;
  offerType: TOfferType;
  orderHoldDeposit?: InputMaybe<Scalars['Float']>;
  orderInfo: OrderInfoInput;
  orderResult: OrderResultInput;
  parentOrder?: InputMaybe<Scalars['String']>;
  teeOfferInfo?: InputMaybe<TeeOfferInfoInput>;
};

export type Provider = {
  __typename?: 'Provider';
  /** system identifier */
  _id: Scalars['String'];
  /** contract address */
  address: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  availableDeposit?: Maybe<Scalars['Float']>;
  origins?: Maybe<Origins>;
  providerInfo: ProviderInfo;
  teeOffers?: Maybe<Array<Scalars['String']>>;
  valueOffers?: Maybe<Array<Scalars['String']>>;
};

export type ProviderConnection = {
  __typename?: 'ProviderConnection';
  edges?: Maybe<Array<ProviderEdge>>;
  pageInfo?: Maybe<ProviderPageInfo>;
};

export type ProviderEdge = {
  __typename?: 'ProviderEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Provider>;
};

export type ProviderFilter = {
  /** filter by contract address */
  address?: InputMaybe<Scalars['String']>;
};

export type ProviderInfo = {
  __typename?: 'ProviderInfo';
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInfoInput = {
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInformation = {
  __typename?: 'ProviderInformation';
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInformationInput = {
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInputType = {
  authority?: InputMaybe<Scalars['String']>;
  availableDeposit?: InputMaybe<Scalars['Float']>;
  providerInfo: ProviderInfoInput;
  teeOffers?: InputMaybe<Array<Scalars['String']>>;
  valueOffers?: InputMaybe<Array<Scalars['String']>>;
};

export type ProviderPageInfo = {
  __typename?: 'ProviderPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  balanceOf: Scalars['String'];
  config: Config;
  configs: ListConfigResponse;
  erc20: Erc20;
  listErc20: ListErc20Response;
  listLocking: ListLockingResponse;
  listStaking: ListStakingResponse;
  locking: Locking;
  offer: Offer;
  offers: ListOffersResponse;
  order: Order;
  orders: ListOrdersResponse;
  provider: Provider;
  providers: ListProvidersResponse;
  staking: Staking;
  teeOffer: TeeOffer;
  teeOffers: ListTeeOffersResponse;
};


export type QueryBalanceOfArgs = {
  address: Scalars['String'];
};


export type QueryConfigArgs = {
  _id: Scalars['String'];
};


export type QueryConfigsArgs = {
  filter?: InputMaybe<ConfigFilter>;
  pagination: ConnectionArgs;
};


export type QueryErc20Args = {
  _id: Scalars['String'];
};


export type QueryListErc20Args = {
  filter?: InputMaybe<Erc20rFilter>;
  pagination: ConnectionArgs;
};


export type QueryListLockingArgs = {
  filter?: InputMaybe<LockingFilter>;
  pagination: ConnectionArgs;
};


export type QueryListStakingArgs = {
  filter?: InputMaybe<StakingFilter>;
  pagination: ConnectionArgs;
};


export type QueryLockingArgs = {
  _id: Scalars['String'];
};


export type QueryOfferArgs = {
  _id: Scalars['String'];
};


export type QueryOffersArgs = {
  filter?: InputMaybe<OfferFilter>;
  pagination: ConnectionArgs;
};


export type QueryOrderArgs = {
  address: Scalars['String'];
};


export type QueryOrdersArgs = {
  filter?: InputMaybe<OrdersFilter>;
  pagination: ConnectionArgs;
};


export type QueryProviderArgs = {
  _id: Scalars['String'];
};


export type QueryProvidersArgs = {
  filter: ProviderFilter;
  pagination: ConnectionArgs;
};


export type QueryStakingArgs = {
  _id: Scalars['String'];
};


export type QueryTeeOfferArgs = {
  _id: Scalars['String'];
};


export type QueryTeeOffersArgs = {
  filter?: InputMaybe<TeeOfferFilter>;
  pagination: ConnectionArgs;
};

export type StakeInfo = {
  __typename?: 'StakeInfo';
  amount: Scalars['Float'];
  profit: Scalars['Float'];
  startDate: Scalars['Float'];
  totalLocked: Scalars['Float'];
};

export type StakeInfoInput = {
  amount: Scalars['Float'];
  profit: Scalars['Float'];
  startDate: Scalars['Float'];
  totalLocked: Scalars['Float'];
};

export type Staking = {
  __typename?: 'Staking';
  /** system identifier */
  _id: Scalars['String'];
  /** owner address */
  owner: Scalars['String'];
  stakeInfo: StakeInfo;
};

export type StakingConnection = {
  __typename?: 'StakingConnection';
  edges?: Maybe<Array<StakingEdge>>;
  pageInfo?: Maybe<StakingPageInfo>;
};

export type StakingEdge = {
  __typename?: 'StakingEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Staking>;
};

export type StakingFilter = {
  /** filter by owner address */
  owner?: InputMaybe<Scalars['String']>;
};

export type StakingInputType = {
  /** system identifier */
  _id: Scalars['String'];
  /** owner address */
  owner: Scalars['String'];
  stakeInfo: StakeInfoInput;
};

export type StakingPageInfo = {
  __typename?: 'StakingPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Stats = {
  __typename?: 'Stats';
  freeCores: Scalars['Float'];
  ordersInQueue: Scalars['Float'];
};

export type StatsInput = {
  freeCores: Scalars['Float'];
  ordersInQueue: Scalars['Float'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** event - create or update an entity */
  event: SubscriptionPayload;
};

export type SubscriptionPayload = {
  __typename?: 'SubscriptionPayload';
  data?: Maybe<Array<Scalars['String']>>;
  subscriptionSource: SubscriptionSource;
  type: SubscriptionType;
};

export enum SubscriptionSource {
  Config = 'CONFIG',
  Erc20 = 'ERC20',
  Locking = 'LOCKING',
  Offer = 'OFFER',
  Order = 'ORDER',
  Provider = 'PROVIDER',
  Staking = 'STAKING',
  TeeOffer = 'TEE_OFFER',
  Voting = 'VOTING'
}

export enum SubscriptionType {
  Add = 'add',
  Approve = 'approve',
  Default = 'default',
  Update = 'update'
}

/** The supported LockInfo sources. */
export enum TLockInfoSource {
  Orders = 'Orders',
  ProviderRegistry = 'ProviderRegistry',
  TeeOffersFactory = 'TeeOffersFactory',
  Voting = 'Voting'
}

/** The supported offers type. */
export enum TOfferType {
  Data = 'Data',
  Solution = 'Solution',
  Storage = 'Storage',
  TeeOffer = 'TeeOffer'
}

export type TeeOffer = {
  __typename?: 'TeeOffer';
  /** system identifier */
  _id: Scalars['String'];
  /** contract address */
  address: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  disabledAfter: Scalars['Float'];
  origins?: Maybe<Origins>;
  providerAddress: Scalars['String'];
  providerInfo: ProviderInformation;
  stats?: Maybe<Stats>;
  teeOfferInfo: TeeOfferInfo;
};

export type TeeOfferConnection = {
  __typename?: 'TeeOfferConnection';
  edges?: Maybe<Array<TeeOfferEdge>>;
  pageInfo?: Maybe<TeeOfferPageInfo>;
};

export type TeeOfferEdge = {
  __typename?: 'TeeOfferEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<TeeOffer>;
};

export type TeeOfferFilter = {
  /** filter by contract address */
  address?: InputMaybe<Scalars['String']>;
  /** filter by contract addresses */
  addresses?: InputMaybe<Array<Scalars['String']>>;
  /** filter by teeOfferInfo → name */
  name?: InputMaybe<Scalars['String']>;
};

export type TeeOfferInfo = {
  __typename?: 'TeeOfferInfo';
  argsPublicKey: Scalars['String'];
  description: Scalars['String'];
  minTimeMinutes: Scalars['Float'];
  name: Scalars['String'];
  properties: Scalars['String'];
  slots: Scalars['Float'];
  tcb: Scalars['String'];
  teeType: Scalars['String'];
  tlb: Scalars['String'];
};

export type TeeOfferInfoInput = {
  argsPublicKey: Scalars['String'];
  description: Scalars['String'];
  minTimeMinutes: Scalars['Float'];
  name: Scalars['String'];
  properties: Scalars['String'];
  slots: Scalars['Float'];
  tcb: Scalars['String'];
  teeType: Scalars['String'];
  tlb: Scalars['String'];
};

export type TeeOfferInputType = {
  disabledAfter: Scalars['Float'];
  providerAddress: Scalars['String'];
  providerInfo: ProviderInformationInput;
  stats?: InputMaybe<StatsInput>;
  teeOfferInfo: TeeOfferInfoInput;
};

export type TeeOfferPageInfo = {
  __typename?: 'TeeOfferPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type TransactionOptions = {
  __typename?: 'TransactionOptions';
  from: Scalars['String'];
  gas: Scalars['Float'];
  gasPrice: Scalars['String'];
  web3: Web3;
};

export type TransactionOptionsInputType = {
  from: Scalars['String'];
  gas: Scalars['Float'];
  gasPrice: Scalars['String'];
  web3: Web3InputType;
};

export type TransferInputType = {
  to: Scalars['String'];
  transactionOptions?: InputMaybe<TransactionOptionsInputType>;
};

export type UpdateConfigInput = {
  _id: Scalars['String'];
  /** config name */
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<ValueObjectType>;
};

export type UpdateProviderInput = {
  _id: Scalars['String'];
  /** provider contract address */
  address?: InputMaybe<Scalars['String']>;
  authority?: InputMaybe<Scalars['String']>;
  availableDeposit?: InputMaybe<Scalars['Float']>;
  origins?: InputMaybe<OriginsInput>;
  providerInfo?: InputMaybe<ProviderInfoInput>;
  teeOffers?: InputMaybe<Array<Scalars['String']>>;
  valueOffers?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateTeeOfferInput = {
  _id: Scalars['String'];
  /** provider contract address */
  address?: InputMaybe<Scalars['String']>;
  authority?: InputMaybe<Scalars['String']>;
  offerInfo?: InputMaybe<TeeOfferInfoInput>;
  origins?: InputMaybe<OriginsInput>;
  provider?: InputMaybe<Scalars['String']>;
};

export type ValueObject = {
  __typename?: 'ValueObject';
  actionAccountAddress?: Maybe<Scalars['String']>;
  authorityAccountAddress?: Maybe<Scalars['String']>;
  consensus?: Maybe<Scalars['String']>;
  epochDurationSeconds?: Maybe<Scalars['Float']>;
  epochs?: Maybe<Scalars['String']>;
  lastBlocks?: Maybe<Scalars['String']>;
  offerSecDeposit?: Maybe<Scalars['Float']>;
  orderMinimumDeposit?: Maybe<Scalars['Float']>;
  ordersFactory?: Maybe<Scalars['String']>;
  profitWithdrawDelayDays?: Maybe<Scalars['Float']>;
  providerRegistry?: Maybe<Scalars['String']>;
  staking?: Maybe<Scalars['String']>;
  stopDelayDays?: Maybe<Scalars['Float']>;
  superpro?: Maybe<Scalars['String']>;
  suspicious?: Maybe<Scalars['String']>;
  teeOfferSecDeposit?: Maybe<Scalars['Float']>;
  teeOffersFactory?: Maybe<Scalars['String']>;
  teeRewardPerEpoch?: Maybe<Scalars['Float']>;
  token?: Maybe<Scalars['String']>;
  tokenReceiverAddress?: Maybe<Scalars['String']>;
  valueOffersFactory?: Maybe<Scalars['String']>;
  voting?: Maybe<Scalars['String']>;
  votingDeposit?: Maybe<Scalars['Float']>;
  votingDurationDays?: Maybe<Scalars['Float']>;
  votingExecutionTimeoutDays?: Maybe<Scalars['Float']>;
  votingHoldDays?: Maybe<Scalars['Float']>;
  votingMinimumTurnout?: Maybe<Scalars['Float']>;
};

export type ValueObjectType = {
  actionAccountAddress?: InputMaybe<Scalars['String']>;
  authorityAccountAddress?: InputMaybe<Scalars['String']>;
  consensus?: InputMaybe<Scalars['String']>;
  epochDurationSeconds?: InputMaybe<Scalars['Float']>;
  epochs?: InputMaybe<Scalars['String']>;
  lastBlocks?: InputMaybe<Scalars['String']>;
  offerSecDeposit?: InputMaybe<Scalars['Float']>;
  orderMinimumDeposit?: InputMaybe<Scalars['Float']>;
  ordersFactory?: InputMaybe<Scalars['String']>;
  profitWithdrawDelayDays?: InputMaybe<Scalars['Float']>;
  providerRegistry?: InputMaybe<Scalars['String']>;
  staking?: InputMaybe<Scalars['String']>;
  stopDelayDays?: InputMaybe<Scalars['Float']>;
  superpro?: InputMaybe<Scalars['String']>;
  suspicious?: InputMaybe<Scalars['String']>;
  teeOfferSecDeposit?: InputMaybe<Scalars['Float']>;
  teeOffersFactory?: InputMaybe<Scalars['String']>;
  teeRewardPerEpoch?: InputMaybe<Scalars['Float']>;
  token?: InputMaybe<Scalars['String']>;
  tokenReceiverAddress?: InputMaybe<Scalars['String']>;
  valueOffersFactory?: InputMaybe<Scalars['String']>;
  voting?: InputMaybe<Scalars['String']>;
  votingDeposit?: InputMaybe<Scalars['Float']>;
  votingDurationDays?: InputMaybe<Scalars['Float']>;
  votingExecutionTimeoutDays?: InputMaybe<Scalars['Float']>;
  votingHoldDays?: InputMaybe<Scalars['Float']>;
  votingMinimumTurnout?: InputMaybe<Scalars['Float']>;
};

export type Web3 = {
  __typename?: 'Web3';
  defaultAccount?: Maybe<Scalars['String']>;
  defaultBlock?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type Web3InputType = {
  defaultAccount?: InputMaybe<Scalars['String']>;
  defaultBlock?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
};

export type PageDataDtoFragmentFragment = { __typename?: 'PageDataDto', count: number, limit: number, offset: number };

export type EventSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EventSubscription = { __typename?: 'Subscription', event: { __typename?: 'SubscriptionPayload', data?: Array<string> | null, type: SubscriptionType, subscriptionSource: SubscriptionSource } };

export type TransferMutationVariables = Exact<{
  transfer: TransferInputType;
}>;


export type TransferMutation = { __typename?: 'Mutation', transfer: string };

export type OffersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OfferFilter>;
}>;


export type OffersQuery = { __typename?: 'Query', result: { __typename?: 'ListOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OfferConnection', pageInfo?: { __typename?: 'OfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'OfferEdge', cursor?: string | null, node?: { __typename?: 'Offer', _id: string, address: string, authority?: string | null, offerInfo: { __typename?: 'OfferInfo', group: string, offerType: string, allowedAccounts?: Array<string> | null, allowedArgs?: string | null, argsPublicKey: string, cancelable: boolean, description: string, disabledAfter: number, hash: string, holdSum: number, inputFormat: string, linkage: string, maxDurationTimeMinutes: number, name: string, outputFormat: string, properties: string, resultUrl: string, restrictions?: { __typename?: 'OfferRestrictions', offers?: Array<string> | null, types?: Array<TOfferType> | null } | null }, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInformation', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string } } | null }> | null } } };

export type OffersSelectQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OfferFilter>;
}>;


export type OffersSelectQuery = { __typename?: 'Query', result: { __typename?: 'ListOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OfferConnection', pageInfo?: { __typename?: 'OfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'OfferEdge', cursor?: string | null, node?: { __typename?: 'Offer', address: string, offerInfo: { __typename?: 'OfferInfo', name: string, description: string } } | null }> | null } } };

export type OffersRestrictionsQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OfferFilter>;
}>;


export type OffersRestrictionsQuery = { __typename?: 'Query', result: { __typename?: 'ListOffersResponse', page: { __typename?: 'OfferConnection', edges?: Array<{ __typename?: 'OfferEdge', node?: { __typename?: 'Offer', address: string, offerInfo: { __typename?: 'OfferInfo', restrictions?: { __typename?: 'OfferRestrictions', offers?: Array<string> | null } | null } } | null }> | null } } };

export type OrdersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OrdersFilter>;
}>;


export type OrdersQuery = { __typename?: 'Query', result: { __typename?: 'ListOrdersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OrderConnection', edges?: Array<{ __typename?: 'OrderEdge', cursor?: string | null, node?: { __typename?: 'Order', _id: string, address: string, authority?: string | null, consumer: string, orderHoldDeposit?: number | null, depositSpent?: string | null, offerType: TOfferType, parentOrder?: { __typename?: 'ParentOrder', address: string, offerInfo?: { __typename?: 'OfferInfo', name: string } | null } | null, offerInfo?: { __typename?: 'OfferInfo', name: string, offerType: string } | null, orderInfo: { __typename?: 'OrderInfo', offer: string, status: string }, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string } | null, subOrders?: Array<{ __typename?: 'BaseOrder', offerType: TOfferType, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string } | null, offerInfo?: { __typename?: 'OfferInfo', name: string } | null }> | null } | null }> | null, pageInfo?: { __typename?: 'OrderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type OrdersSelectQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OrdersFilter>;
}>;


export type OrdersSelectQuery = { __typename?: 'Query', result: { __typename?: 'ListOrdersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OrderConnection', edges?: Array<{ __typename?: 'OrderEdge', cursor?: string | null, node?: { __typename?: 'Order', address: string, offerInfo?: { __typename?: 'OfferInfo', holdSum: number } | null } | null }> | null, pageInfo?: { __typename?: 'OrderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type OrderQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type OrderQuery = { __typename?: 'Query', order: { __typename?: 'Order', address: string, consumer: string, orderHoldDeposit?: number | null, depositSpent?: string | null, offerType: TOfferType, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, orderInfo: { __typename?: 'OrderInfo', status: string, offer: string }, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string, description: string } | null, orderResult: { __typename?: 'OrderResult', encryptedError?: string | null, encryptedResult?: string | null } } };

export type SubOrdersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OrdersFilter>;
}>;


export type SubOrdersQuery = { __typename?: 'Query', result: { __typename?: 'ListOrdersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OrderConnection', edges?: Array<{ __typename?: 'OrderEdge', cursor?: string | null, node?: { __typename?: 'Order', _id: string, address: string, authority?: string | null, consumer: string, orderHoldDeposit?: number | null, depositSpent?: string | null, offerType: TOfferType, offerInfo?: { __typename?: 'OfferInfo', name: string, offerType: string, cancelable: boolean, description: string } | null, orderInfo: { __typename?: 'OrderInfo', offer: string, status: string }, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string, description: string } | null } | null }> | null, pageInfo?: { __typename?: 'OrderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type ProvidersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter: ProviderFilter;
}>;


export type ProvidersQuery = { __typename?: 'Query', result: { __typename?: 'ListProvidersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'ProviderConnection', pageInfo?: { __typename?: 'ProviderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'ProviderEdge', cursor?: string | null, node?: { __typename?: 'Provider', _id: string, address: string, authority?: string | null, availableDeposit?: number | null, valueOffers?: Array<string> | null, teeOffers?: Array<string> | null, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInfo', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string } } | null }> | null } } };

export type TeeOffersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<TeeOfferFilter>;
}>;


export type TeeOffersQuery = { __typename?: 'Query', result: { __typename?: 'ListTeeOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'TeeOfferConnection', edges?: Array<{ __typename?: 'TeeOfferEdge', cursor?: string | null, node?: { __typename?: 'TeeOffer', _id: string, address: string, authority?: string | null, disabledAfter: number, providerAddress: string, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInformation', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string }, stats?: { __typename?: 'Stats', freeCores: number, ordersInQueue: number } | null, teeOfferInfo: { __typename?: 'TeeOfferInfo', argsPublicKey: string, description: string, minTimeMinutes: number, name: string, properties: string, slots: number, tcb: string, teeType: string, tlb: string } } | null }> | null, pageInfo?: { __typename?: 'TeeOfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type TeeOffersSelectQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<TeeOfferFilter>;
}>;


export type TeeOffersSelectQuery = { __typename?: 'Query', result: { __typename?: 'ListTeeOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'TeeOfferConnection', pageInfo?: { __typename?: 'TeeOfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'TeeOfferEdge', cursor?: string | null, node?: { __typename?: 'TeeOffer', address: string, teeOfferInfo: { __typename?: 'TeeOfferInfo', name: string, description: string } } | null }> | null } } };

export const PageDataDtoFragmentFragmentDoc = gql`
    fragment PageDataDtoFragment on PageDataDto {
  count
  limit
  offset
}
    `;
export const EventDocument = gql`
    subscription Event {
  event {
    data
    type
    subscriptionSource
  }
}
    `;

/**
 * __useEventSubscription__
 *
 * To run a query within a React component, call `useEventSubscription` and pass it any options that fit your needs.
 * When your component renders, `useEventSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventSubscription({
 *   variables: {
 *   },
 * });
 */
export function useEventSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<EventSubscription, EventSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<EventSubscription, EventSubscriptionVariables>(EventDocument, options);
      }
export type EventSubscriptionHookResult = ReturnType<typeof useEventSubscription>;
export type EventSubscriptionResult = Apollo.SubscriptionResult<EventSubscription>;
export const TransferDocument = gql`
    mutation Transfer($transfer: TransferInputType!) {
  transfer(transfer: $transfer)
}
    `;
export type TransferMutationFn = Apollo.MutationFunction<TransferMutation, TransferMutationVariables>;

/**
 * __useTransferMutation__
 *
 * To run a mutation, you first call `useTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transferMutation, { data, loading, error }] = useTransferMutation({
 *   variables: {
 *      transfer: // value for 'transfer'
 *   },
 * });
 */
export function useTransferMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TransferMutation, TransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TransferMutation, TransferMutationVariables>(TransferDocument, options);
      }
export type TransferMutationHookResult = ReturnType<typeof useTransferMutation>;
export type TransferMutationResult = Apollo.MutationResult<TransferMutation>;
export type TransferMutationOptions = Apollo.BaseMutationOptions<TransferMutation, TransferMutationVariables>;
export const OffersDocument = gql`
    query Offers($pagination: ConnectionArgs!, $filter: OfferFilter) {
  result: offers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          _id
          address
          authority
          offerInfo {
            group
            offerType
            allowedAccounts
            allowedArgs
            argsPublicKey
            cancelable
            description
            disabledAfter
            hash
            holdSum
            inputFormat
            linkage
            maxDurationTimeMinutes
            name
            outputFormat
            properties
            resultUrl
            restrictions {
              offers
              types
            }
          }
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          providerInfo {
            actionAccount
            description
            metadata
            name
            tokenReceiver
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useOffersQuery__
 *
 * To run a query within a React component, call `useOffersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOffersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOffersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useOffersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<OffersQuery, OffersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OffersQuery, OffersQueryVariables>(OffersDocument, options);
      }
export function useOffersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OffersQuery, OffersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OffersQuery, OffersQueryVariables>(OffersDocument, options);
        }
export type OffersQueryHookResult = ReturnType<typeof useOffersQuery>;
export type OffersLazyQueryHookResult = ReturnType<typeof useOffersLazyQuery>;
export type OffersQueryResult = Apollo.QueryResult<OffersQuery, OffersQueryVariables>;
export const OffersSelectDocument = gql`
    query OffersSelect($pagination: ConnectionArgs!, $filter: OfferFilter) {
  result: offers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          address
          offerInfo {
            name
            description
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useOffersSelectQuery__
 *
 * To run a query within a React component, call `useOffersSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useOffersSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOffersSelectQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useOffersSelectQuery(baseOptions: ApolloReactHooks.QueryHookOptions<OffersSelectQuery, OffersSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OffersSelectQuery, OffersSelectQueryVariables>(OffersSelectDocument, options);
      }
export function useOffersSelectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OffersSelectQuery, OffersSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OffersSelectQuery, OffersSelectQueryVariables>(OffersSelectDocument, options);
        }
export type OffersSelectQueryHookResult = ReturnType<typeof useOffersSelectQuery>;
export type OffersSelectLazyQueryHookResult = ReturnType<typeof useOffersSelectLazyQuery>;
export type OffersSelectQueryResult = Apollo.QueryResult<OffersSelectQuery, OffersSelectQueryVariables>;
export const OffersRestrictionsDocument = gql`
    query OffersRestrictions($pagination: ConnectionArgs!, $filter: OfferFilter) {
  result: offers(pagination: $pagination, filter: $filter) {
    page {
      edges {
        node {
          address
          offerInfo {
            restrictions {
              offers
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useOffersRestrictionsQuery__
 *
 * To run a query within a React component, call `useOffersRestrictionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOffersRestrictionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOffersRestrictionsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useOffersRestrictionsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<OffersRestrictionsQuery, OffersRestrictionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OffersRestrictionsQuery, OffersRestrictionsQueryVariables>(OffersRestrictionsDocument, options);
      }
export function useOffersRestrictionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OffersRestrictionsQuery, OffersRestrictionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OffersRestrictionsQuery, OffersRestrictionsQueryVariables>(OffersRestrictionsDocument, options);
        }
export type OffersRestrictionsQueryHookResult = ReturnType<typeof useOffersRestrictionsQuery>;
export type OffersRestrictionsLazyQueryHookResult = ReturnType<typeof useOffersRestrictionsLazyQuery>;
export type OffersRestrictionsQueryResult = Apollo.QueryResult<OffersRestrictionsQuery, OffersRestrictionsQueryVariables>;
export const OrdersDocument = gql`
    query Orders($pagination: ConnectionArgs!, $filter: OrdersFilter) {
  result: orders(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          _id
          address
          authority
          consumer
          orderHoldDeposit
          depositSpent
          parentOrder {
            offerInfo {
              name
            }
            address
          }
          offerInfo {
            name
            offerType
          }
          offerType
          orderInfo {
            offer
            status
          }
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          teeOfferInfo {
            name
          }
          subOrders {
            teeOfferInfo {
              name
            }
            offerInfo {
              name
            }
            offerType
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useOrdersQuery__
 *
 * To run a query within a React component, call `useOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrdersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useOrdersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
      }
export function useOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
        }
export type OrdersQueryHookResult = ReturnType<typeof useOrdersQuery>;
export type OrdersLazyQueryHookResult = ReturnType<typeof useOrdersLazyQuery>;
export type OrdersQueryResult = Apollo.QueryResult<OrdersQuery, OrdersQueryVariables>;
export const OrdersSelectDocument = gql`
    query OrdersSelect($pagination: ConnectionArgs!, $filter: OrdersFilter) {
  result: orders(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          address
          offerInfo {
            holdSum
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useOrdersSelectQuery__
 *
 * To run a query within a React component, call `useOrdersSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrdersSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrdersSelectQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useOrdersSelectQuery(baseOptions: ApolloReactHooks.QueryHookOptions<OrdersSelectQuery, OrdersSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OrdersSelectQuery, OrdersSelectQueryVariables>(OrdersSelectDocument, options);
      }
export function useOrdersSelectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OrdersSelectQuery, OrdersSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OrdersSelectQuery, OrdersSelectQueryVariables>(OrdersSelectDocument, options);
        }
export type OrdersSelectQueryHookResult = ReturnType<typeof useOrdersSelectQuery>;
export type OrdersSelectLazyQueryHookResult = ReturnType<typeof useOrdersSelectLazyQuery>;
export type OrdersSelectQueryResult = Apollo.QueryResult<OrdersSelectQuery, OrdersSelectQueryVariables>;
export const OrderDocument = gql`
    query Order($id: String!) {
  order(address: $id) {
    address
    consumer
    origins {
      createdBy
      createdDate
      modifiedBy
      modifiedDate
    }
    orderHoldDeposit
    depositSpent
    offerType
    orderInfo {
      status
      offer
    }
    teeOfferInfo {
      name
      description
    }
    orderResult {
      encryptedError
      encryptedResult
    }
  }
}
    `;

/**
 * __useOrderQuery__
 *
 * To run a query within a React component, call `useOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderQuery(baseOptions: ApolloReactHooks.QueryHookOptions<OrderQuery, OrderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OrderQuery, OrderQueryVariables>(OrderDocument, options);
      }
export function useOrderLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OrderQuery, OrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OrderQuery, OrderQueryVariables>(OrderDocument, options);
        }
export type OrderQueryHookResult = ReturnType<typeof useOrderQuery>;
export type OrderLazyQueryHookResult = ReturnType<typeof useOrderLazyQuery>;
export type OrderQueryResult = Apollo.QueryResult<OrderQuery, OrderQueryVariables>;
export const SubOrdersDocument = gql`
    query SubOrders($pagination: ConnectionArgs!, $filter: OrdersFilter) {
  result: orders(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          _id
          address
          authority
          consumer
          orderHoldDeposit
          depositSpent
          offerInfo {
            name
            offerType
            cancelable
            description
          }
          offerType
          orderInfo {
            offer
            status
          }
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          teeOfferInfo {
            name
            description
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useSubOrdersQuery__
 *
 * To run a query within a React component, call `useSubOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubOrdersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useSubOrdersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SubOrdersQuery, SubOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SubOrdersQuery, SubOrdersQueryVariables>(SubOrdersDocument, options);
      }
export function useSubOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SubOrdersQuery, SubOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SubOrdersQuery, SubOrdersQueryVariables>(SubOrdersDocument, options);
        }
export type SubOrdersQueryHookResult = ReturnType<typeof useSubOrdersQuery>;
export type SubOrdersLazyQueryHookResult = ReturnType<typeof useSubOrdersLazyQuery>;
export type SubOrdersQueryResult = Apollo.QueryResult<SubOrdersQuery, SubOrdersQueryVariables>;
export const ProvidersDocument = gql`
    query Providers($pagination: ConnectionArgs!, $filter: ProviderFilter!) {
  result: providers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          _id
          address
          authority
          availableDeposit
          valueOffers
          teeOffers
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          providerInfo {
            actionAccount
            description
            metadata
            name
            tokenReceiver
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useProvidersQuery__
 *
 * To run a query within a React component, call `useProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProvidersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useProvidersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ProvidersQuery, ProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ProvidersQuery, ProvidersQueryVariables>(ProvidersDocument, options);
      }
export function useProvidersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProvidersQuery, ProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ProvidersQuery, ProvidersQueryVariables>(ProvidersDocument, options);
        }
export type ProvidersQueryHookResult = ReturnType<typeof useProvidersQuery>;
export type ProvidersLazyQueryHookResult = ReturnType<typeof useProvidersLazyQuery>;
export type ProvidersQueryResult = Apollo.QueryResult<ProvidersQuery, ProvidersQueryVariables>;
export const TeeOffersDocument = gql`
    query TeeOffers($pagination: ConnectionArgs!, $filter: TeeOfferFilter) {
  result: teeOffers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          _id
          address
          authority
          disabledAfter
          providerAddress
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          providerInfo {
            actionAccount
            description
            metadata
            name
            tokenReceiver
          }
          stats {
            freeCores
            ordersInQueue
          }
          teeOfferInfo {
            argsPublicKey
            description
            minTimeMinutes
            name
            properties
            slots
            tcb
            teeType
            tlb
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useTeeOffersQuery__
 *
 * To run a query within a React component, call `useTeeOffersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeeOffersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeeOffersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useTeeOffersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TeeOffersQuery, TeeOffersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TeeOffersQuery, TeeOffersQueryVariables>(TeeOffersDocument, options);
      }
export function useTeeOffersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TeeOffersQuery, TeeOffersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TeeOffersQuery, TeeOffersQueryVariables>(TeeOffersDocument, options);
        }
export type TeeOffersQueryHookResult = ReturnType<typeof useTeeOffersQuery>;
export type TeeOffersLazyQueryHookResult = ReturnType<typeof useTeeOffersLazyQuery>;
export type TeeOffersQueryResult = Apollo.QueryResult<TeeOffersQuery, TeeOffersQueryVariables>;
export const TeeOffersSelectDocument = gql`
    query TeeOffersSelect($pagination: ConnectionArgs!, $filter: TeeOfferFilter) {
  result: teeOffers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          address
          teeOfferInfo {
            name
            description
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;

/**
 * __useTeeOffersSelectQuery__
 *
 * To run a query within a React component, call `useTeeOffersSelectQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeeOffersSelectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeeOffersSelectQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useTeeOffersSelectQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TeeOffersSelectQuery, TeeOffersSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TeeOffersSelectQuery, TeeOffersSelectQueryVariables>(TeeOffersSelectDocument, options);
      }
export function useTeeOffersSelectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TeeOffersSelectQuery, TeeOffersSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TeeOffersSelectQuery, TeeOffersSelectQueryVariables>(TeeOffersSelectDocument, options);
        }
export type TeeOffersSelectQueryHookResult = ReturnType<typeof useTeeOffersSelectQuery>;
export type TeeOffersSelectLazyQueryHookResult = ReturnType<typeof useTeeOffersSelectLazyQuery>;
export type TeeOffersSelectQueryResult = Apollo.QueryResult<TeeOffersSelectQuery, TeeOffersSelectQueryVariables>;