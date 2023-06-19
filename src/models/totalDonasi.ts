import { InferSchemaType, Schema, model } from "mongoose";

const danaSchema = new Schema(
  {
    totalTarget: { type: Number, default: 40000000, immutable: true },
    totalDana: { type: Number, required: true },
  },
  { timestamps: true }
);

type danaWakaf = InferSchemaType<typeof danaSchema>;

export default model<danaWakaf>("danaWakaf", danaSchema);
