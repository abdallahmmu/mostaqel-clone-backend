import { Schema, model } from "mongoose";

const messageSchema = Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
      enums: ["freelancer", "client"],
    },
    attachments: [String],
  },
  {
    timestamps: true,
  }
);
const setFileURL = (doc) => {
  if (doc.attachments) {
    const filesList = [];
    doc.attachments.forEach((file) => {
      const fileUrl = `${process.env.BASE_URL}/uploads/chats/${file}`;
      filesList.push(fileUrl);
    });
    doc.attachments = filesList;
  }
};
// findOne, findAll and update
messageSchema.post("init", (doc) => {
  setFileURL(doc);
});

// create
messageSchema.post("save", (doc) => {
  setFileURL(doc);
});
const messageModel = model("message", messageSchema);
export default messageModel;
