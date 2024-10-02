import { ExchangeNames, RoutingKeys } from "@danieltalx/jobber-shared";

export enum MsExchangeNames {
    JobberBuyerUpdate = ExchangeNames.JobberBuyerUpdate,
    JobberSellerUpdate = 'jobber-seller-update',
    JobberReview = 'jobber-review',
    JobberUpdateGig = 'jobber-update-gig',
    JobberGig = 'jobber-gig',
    JobberSeedGig = 'jobber-seed-gig',
}

export enum MsRoutingKeys {
    UserBuyer = RoutingKeys.UserBuyer,
    UserSeller = 'user-seller',
    UpdateGig = 'update-gig',
    GetSellers = 'get-sellers',
    ReceiveSellers = 'receive-sellers',
}

export enum MsQueueNames {
    UserBuyerQueue = 'user-buyer-queue',
    UserSellerQueue = 'user-seller-queue',
    SellerReviewQueue = 'seller-review-queue',
    UserGigQueue = 'user-gig-queue',
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