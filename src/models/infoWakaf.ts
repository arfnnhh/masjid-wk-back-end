import { InferSchemaType, Schema, model } from "mongoose";

const wakafSchema = new Schema(
  {
    nama: { type: String, required: true },
    paket: { type: String, enum: ["Paket-1", "Paket-2"], required: true },
    nominalBarang: { type: Number, required: true, min: 50000 },
    kategori: { type: String, enum: ["Uang", "Barang"] },
  },
  { timestamps: true }
);

type infoWakaf = InferSchemaType<typeof wakafSchema>;

export default model<infoWakaf>("infoWakaf", wakafSchema);
