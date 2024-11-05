import { Request, Response, Router } from "express";
import {
  createCountry,
  deleteCountryById,
  getAllCountries,
  updateCountryById,
} from "./country.service";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const countries = await getAllCountries();

  res.status(200).json({ status: 200, message: "", data: countries });
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const countryData = req.body;

    if (!countryData) {
      throw Error("All fields are required");
    }

    const country = await createCountry(countryData);

    res.status(201).json({
      data: country,
      message: "country added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add country" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const countryId = Number(req.params.id);

  try {
    await deleteCountryById(countryId);

    res.status(200).json({ message: "Country Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Something went wrong!", message: error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const countryId = Number(req.params.id);
    const countryData = req.body;

    if (!countryData) {
      res.status(400).json({ error: "All fields are required" });
    }

    const country = await updateCountryById(countryId, countryData);

    res.status(200).json({
      data: country,
      message: "Data updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update country" });
  }
});

export default router;
