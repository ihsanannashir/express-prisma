import prisma from "../shared/database";
import { ClubData } from "../shared/types/club";

const findCountries = async () => {
  const countries = await prisma.country.findMany();

  return countries;
};

const insertCountry = async (countryData: ClubData) => {
  const country = await prisma.country.create({
    data: {
      name: countryData.name,
    },
  });

  return country;
};

const deleteCountry = async (countryId: number) => {
  await prisma.country.delete({
    where: {
      id: countryId,
    },
  });
};

const editCountry = async (countryId: number, countryData: ClubData) => {
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

export { findCountries, insertCountry, deleteCountry, editCountry };
