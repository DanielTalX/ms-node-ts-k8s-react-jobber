import { MsSchemaNames } from '@chat/enums';
import { IConversationDocument } from '@danieltalx/jobber-shared';
import { Model, Schema, model } from 'mongoose';

const conversationSchema: Schema = new Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  senderUsername: { type: String, required: true, index: true },
  receiverUsername: { type: String, required: true, index: true },
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>(MsSchemaNames.Conversation, conversationSchema, MsSchemaNames.Conversation);
export { ConversationModel };