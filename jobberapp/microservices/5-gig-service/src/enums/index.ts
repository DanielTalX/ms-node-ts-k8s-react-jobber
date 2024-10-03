import { ExchangeNames, RoutingKeys } from "@danieltalx/jobber-shared";

export enum MsExchangeNames {
    JobberSellerUpdate = ExchangeNames.JobberSellerUpdate,
    JobberUpdateGig = ExchangeNames.JobberUpdateGig,
    JobberSeedGig = ExchangeNames.JobberSeedGig,
    JobberGig = ExchangeNames.JobberGig,
}

export enum MsRoutingKeys {
    UserSeller = RoutingKeys.UserSeller,
    UpdateGig = RoutingKeys.UpdateGig,
    ReceiveSellers = RoutingKeys.ReceiveSellers,
    GetSellers = RoutingKeys.GetSellers,
    
}

export enum MsQueueNames {
    GigUpdateQueue = 'gig-update-queue',
    SeedGigQueue = 'seed-gig-queue',
}

export enum MsElasticIndexes {
    gigs = 'gigs'
}

export enum MsSchemaNames {
    Gig = 'Gig',
}