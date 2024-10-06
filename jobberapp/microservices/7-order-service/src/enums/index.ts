import { ExchangeNames, RoutingKeys } from "@danieltalx/jobber-shared";

export enum MsExchangeNames {
    JobberOrderNotification = ExchangeNames.JobberOrderNotification,
    JobberSellerUpdate = ExchangeNames.JobberSellerUpdate,
    JobberBuyerUpdate = ExchangeNames.JobberBuyerUpdate,
    JobberReview = ExchangeNames.JobberReview,
}

export enum MsRoutingKeys {
    OrderEmail = RoutingKeys.OrderEmail,
    UserSeller = RoutingKeys.UserSeller,
    UserBuyer = RoutingKeys.UserBuyer,
}

export enum MsQueueNames {
    OrderReviewQueue = 'order-review-queue',
}

export enum MsElasticIndexes {}

export enum MsSchemaNames {
    Order = 'Order',
    OrderNotification = 'OrderNotification',
}