import { RequestHandler } from "express";
import InfoWakaf from "../models/infoWakaf";
import DanaWakaf from "../models/totalDonasi";
import createHttpError from "http-errors";
import mongoose from "mongoose";

// ngambil data dari database
export const getDataWakaf: RequestHandler = async (req, res, next) => {
  try {
    const info = await InfoWakaf.find().exec();
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

// ngambil spesifik data dr database
export const getWakaf: RequestHandler = async (req, res, next) => {
  const wakafId = req.params.wakafId;
  try {
    if (!mongoose.isValidObjectId(wakafId)) {
      throw createHttpError(400, "Data Wakaf Id tidak valid");
    }

    const wakaf = await InfoWakaf.findById(wakafId).exec();

    if (!wakaf) {
      throw createHttpError(404, "Data Wakaf tidak ditemukan.");
    }

    res.status(200).json(wakaf);
  } catch (error) {
    next(error);
  }
};

interface CreateWakafBody {
  nama: string;
  paket: string;
  nominalBarang: number;
  kategori?: string;
}

// ngebuat data waka baru
// unknown di RequestHandler (44, 45, 47) karena selain variabel di dalam CreateWakafBody bentuk nya bisa apapun
export const createWakaf: RequestHandler<unknown, unknown, CreateWakafBody, unknown> = async (req, res, next) => {
  const nama = req.body.nama;
  const paket: string = req.body.paket;
  const nominalBarang = req.body.nominalBarang;
  let kategori: "Uang" | "Barang";

  try {
    if (!nama) {
      throw createHttpError(400, "Data Wakaf harus memiliki nama!");
    }

    if (!paket) {
      throw createHttpError(400, "Data Wakaf harus memiliki paket!");
    }

    if (!nominalBarang) {
      throw createHttpError(400, "Data Wakaf harus memiliki nominal!");
    }

    if (nominalBarang < 50000) {
      throw createHttpError(400, "Data Wakaf harus memiliki nominal minimal 50.000 rupiah!");
    }

    if (paket === "Paket-2") {
      kategori = "Uang";
    } else if (paket === "Paket-1") {
      kategori = "Barang";
    } else {
      throw createHttpError(400, "Paket tidak valid!");
    }

    const newDataWakaf = await InfoWakaf.create({
      nama: nama,
      paket: paket,
      nominalBarang: nominalBarang,
      kategori: kategori,
    });

    // Update Dana
    const latestNominalBarang = await InfoWakaf.findOne().sort({ createdAt: -1 }).select("nominalBarang").exec();

    if (latestNominalBarang) {
      const dana = await DanaWakaf.findOne().exec();
      if (dana) {
        dana.totalDana += latestNominalBarang.nominalBarang;
        await dana.save();
      }
    }

    res.status(201).json(newDataWakaf);
  } catch (error) {
    next(error);
  }
};



