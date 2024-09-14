export enum ExchangeNames {
    JobberEmailNotification = 'jobber-email-notification',
    JobberOrderNotification = 'jobber-order-notification',
}

export enum RoutingKeys {
    AuthEmail = 'auth-email',
    OrderEmail = 'order-email',
}

export enum QueueNames {
    AuthEmailQueue = 'auth-email-queue',
    OrderEmailQueue = 'order-email-queue',
}

export enum EmailTypes {
    orderPlaced = 'orderPlaced',
    orderReceipt = 'orderReceipt',
}
