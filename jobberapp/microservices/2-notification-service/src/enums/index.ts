import { EmailTypes, ExchangeNames, QueueNames, RoutingKeys } from "@danieltalx/jobber-shared";

export enum MsExchangeNames {
    JobberEmailNotification = ExchangeNames.JobberEmailNotification,
    JobberOrderNotification = ExchangeNames.JobberOrderNotification,
}

export enum MsRoutingKeys {
    AuthEmail = RoutingKeys.AuthEmail,
    OrderEmail = RoutingKeys.OrderEmail,
}

export enum MsQueueNames {
    AuthEmailQueue = QueueNames.AuthEmailQueue,
    OrderEmailQueue = QueueNames.OrderEmailQueue,
}

export enum MsEmailTypes {
    orderPlaced = EmailTypes.orderPlaced,
    orderReceipt = EmailTypes.orderReceipt,
}
