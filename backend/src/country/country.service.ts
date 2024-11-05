import prisma from "../shared/database";
import { ClubData } from "../shared/types/club";
import {
  deleteCountry,
  editCountry,
  findCountries,
  insertCountry,
} from "./country.repository";

const getAllCountries = async () => {
  const countries = await findCountries();

  return countries;
};

const createCountry = async (countryData: ClubData) => {
  const country = await insertCountry(countryData);
  return country;
};

const deleteCountryById = async (countryId: number) => {
  await deleteCountry(countryId);
};

const updateCountryById = async (countryId: number, countryData: ClubData) => {
  const country = await editCountry(countryId, countryData);

  return country;
};

export { getAllCountries, createCountry, deleteCountryById, updateCountryById };
