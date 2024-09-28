import { EmailTypes, ExchangeNames, RoutingKeys } from "@danieltalx/jobber-shared";

export enum MsExchangeNames {
    JobberBuyerUpdate = ExchangeNames.JobberBuyerUpdate,
    JobberEmailNotification = ExchangeNames.JobberEmailNotification,
}

export enum MsRoutingKeys {
    UserBuyer = RoutingKeys.UserBuyer,
    AuthEmail = RoutingKeys.AuthEmail,
}

export enum MsQueueNames {
}

export enum MsEmailTypes {
    verifyEmail = EmailTypes.verifyEmail,
    forgotPassword = EmailTypes.forgotPassword,
    resetPasswordSuccess = EmailTypes.resetPasswordSuccess,
}

export enum MsElasticIndexes {
    gigs = 'gigs'
}