import prisma from "../shared/database";
import { ClubData } from "../shared/types/club";

const getAllCountries = async () => {
  const countries = await prisma.country.findMany();

  return countries;
};

const createCountry = async (countryData: ClubData) => {
  if (!countryData) {
    throw Error("All fields are required");
  }

  const country = await prisma.country.create({
    data: {
      name: countryData.name,
    },
  });

  return country;
};

const deleteCountryById = async (countryId: number) => {
  await prisma.country.delete({
    where: {
      id: countryId,
    },
  });
};

const updateCountryById = async (countryId: number, countryData: ClubData) => {
  const country = await prisma.country.update({
    where: {
      id: countryId,
    },
    data: {
      name: countryData.name,
    },
  });

  return country;
};

export { getAllCountries, createCountry, deleteCountryById, updateCountryById };
