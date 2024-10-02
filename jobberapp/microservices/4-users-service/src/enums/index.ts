import { ExchangeNames, QueueNames, RoutingKeys } from "@danieltalx/jobber-shared";

export enum MsExchangeNames {
    JobberBuyerUpdate = ExchangeNames.JobberBuyerUpdate,
    JobberSellerUpdate = ExchangeNames.JobberSellerUpdate,
    JobberReview = ExchangeNames.JobberReview,
    JobberUpdateGig = ExchangeNames.JobberUpdateGig,
    JobberGig = ExchangeNames.JobberGig,
    JobberSeedGig = ExchangeNames.JobberSeedGig,
}

export enum MsRoutingKeys {
    UserBuyer = RoutingKeys.UserBuyer,
    UserSeller = RoutingKeys.UserSeller,
    UpdateGig = RoutingKeys.UpdateGig,
    GetSellers = RoutingKeys.GetSellers,
    ReceiveSellers = RoutingKeys.ReceiveSellers,
}

export enum MsQueueNames {
    UserBuyerQueue = QueueNames.UserBuyerQueue,
    UserSellerQueue = QueueNames.UserSellerQueue,
    SellerReviewQueue = QueueNames.SellerReviewQueue,
    UserGigQueue = QueueNames.UserGigQueue,
}

export enum MsSchemaNames {
    Buyer = 'Buyer',
    Seller = 'Seller'
}

export enum UserSellerUpdateMsgTypes {
    'create-order',
    'approve-order',
    'update-gig-count',
    'cancel-order'
}