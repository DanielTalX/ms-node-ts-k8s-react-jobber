export enum ExchangeNames {
    JobberEmailNotification = 'jobber-email-notification',
    JobberBuyerUpdate = 'jobber-buyer-update',
    JobberOrderNotification = 'jobber-order-notification',
}

export enum RoutingKeys {
    AuthEmail = 'auth-email',
    UserBuyer = 'user-buyer',
    OrderEmail = 'order-email',
}

export enum QueueNames {
    AuthEmailQueue = 'auth-email-queue',
    OrderEmailQueue = 'order-email-queue',
}

export enum EmailTypes {
    verifyEmail = 'verifyEmail',
    forgotPassword = "forgotPassword",
    resetPasswordSuccess = "resetPasswordSuccess",
    orderPlaced = 'orderPlaced',
    orderReceipt = 'orderReceipt',
}
