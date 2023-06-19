import { RequestHandler } from "express";
import DanaWakaf from "../models/totalDonasi";
import infoWakaf from "../models/infoWakaf";
import createHttpError from "http-errors";
import mongoose from "mongoose";

// ngambil data dari database
export const getDanaWakaf: RequestHandler = async (req, res, next) => {
  try {
    const info = await DanaWakaf.find().exec();
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

// ngambil spesifik data dr database
export const getDana: RequestHandler = async (req, res, next) => {
  const danaId = req.params.danaId;
  try {
    if (!mongoose.isValidObjectId(danaId)) {
      throw createHttpError(400, "Id Dana Wakaf tidak valid");
    }

    const dana = await DanaWakaf.findById(danaId).exec();

    if (!dana) {
      throw createHttpError(404, "Data Dana Wakaf tidak ditemukan.");
    }

    res.status(200).json(dana);
  } catch (error) {
    next(error);
  }
};

interface UpdateDanaParams {
  danaId: string;
}

interface UpdateDanaBody {
    totalTarget: number;
    totalDana: number;
}

// mengupdate data wakaf
// unknown di RequestHandler (80, 82) karena selain variabel di dalam UpdateNoteBody dan UpdateWakafParams bentuk nya bisa apapun
export const updateDana: RequestHandler<UpdateDanaParams, unknown, UpdateDanaBody, unknown> = async (req, res, next) => {
  try {
    const { danaId } = req.params;

    if (!mongoose.isValidObjectId(danaId)) {
      throw createHttpError(400, "Id Data Dana Wakaf tidak valid");
    }

    const nominalBarang = await infoWakaf.findOne().sort({ createdAt: -1 }).select("nominalBarang").exec();

    if (!nominalBarang) {
      throw createHttpError(404, "Data Info Wakaf tidak ditemukan.");
    }

    const dana = await DanaWakaf.findById(danaId).exec();

    if (!dana) {
      throw createHttpError(404, "Data Dana tidak ditemukan.");
    }

    dana.totalDana += nominalBarang.nominalBarang;

    const updatedDana = await dana.save();

    res.status(200).json(updatedDana);
  } catch (error) {
    next(error);
  }
};
