import { Schema, model } from "mongoose";

const offerSchema = Schema(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "freelancer",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    duration: {
      type: Number,
      min: 1,
      required: true,
    },
    amount: {
      type: Number,
      min: 10,
      required: true,
    },
    description: {
      minLenght: 10,
      type: String,
      required: true,
    },
    attachments: [String],
    stage: {
      type: String,
      enums: ["Waiting", "Winning", "Good Luck"],
      default: "Waiting",
    },
  },
  {
    timestamps: true,
  }
);

const setFileURL = (doc) => {
  if (doc.attachments) {
    const filesList = [];
    doc.attachments.forEach((file) => {
      const fileUrl = `${process.env.BASE_URL}/uploads/offers/${file}`;
      filesList.push(fileUrl);
    });
    doc.attachments = filesList;
  }
};
// findOne, findAll and update
offerSchema.post("init", (doc) => {
  setFileURL(doc);
});

// create
offerSchema.post("save", (doc) => {
  setFileURL(doc);
});

const offerModel = model("offer", offerSchema);
export default offerModel;
