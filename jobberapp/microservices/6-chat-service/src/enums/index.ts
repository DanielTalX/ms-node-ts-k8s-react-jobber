import { ExchangeNames, RoutingKeys } from "@danieltalx/jobber-shared";

export enum MsExchangeNames {
    JobberOrderNotification = ExchangeNames.JobberOrderNotification,
}

export enum MsRoutingKeys {
    OrderEmail = RoutingKeys.OrderEmail,
}

export enum MsQueueNames {}

export enum MsElasticIndexes {}

export enum MsSchemaNames {
    Conversation = 'Conversation',
    Message = 'Message',
}