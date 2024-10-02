export enum ExchangeNames {
    JobberEmailNotification = 'jobber-email-notification',
    JobberBuyerUpdate = 'jobber-buyer-update',
    JobberOrderNotification = 'jobber-order-notification',
    JobberSellerUpdate = 'jobber-seller-update',
    JobberReview = 'jobber-review',
    JobberUpdateGig = 'jobber-update-gig',
    JobberGig = 'jobber-gig',
    JobberSeedGig = 'jobber-seed-gig',
}

export enum RoutingKeys {
    AuthEmail = 'auth-email',
    UserBuyer = 'user-buyer',
    OrderEmail = 'order-email',
    UserSeller = 'user-seller',
    UpdateGig = 'update-gig',
    GetSellers = 'get-sellers',
    ReceiveSellers = 'receive-sellers',
}

export enum QueueNames {
    AuthEmailQueue = 'auth-email-queue',
    OrderEmailQueue = 'order-email-queue',
    UserBuyerQueue = 'user-buyer-queue',
    UserSellerQueue = 'user-seller-queue',
    SellerReviewQueue = 'seller-review-queue',
    UserGigQueue = 'user-gig-queue',
}

export enum EmailTypes {
    verifyEmail = 'verifyEmail',
    forgotPassword = "forgotPassword",
    resetPasswordSuccess = "resetPasswordSuccess",
    orderPlaced = 'orderPlaced',
    orderReceipt = 'orderReceipt',
}
