import { useMemo } from "react";
import { Country, State } from "country-state-city";

const useCountry = () => {
  // getting all countries
  const allCountries = useMemo(() => {
    return [
      ...new Set(
        Country.getAllCountries().map((country) => ({
          label: country.name,
          value: country.name,
        }))
      ),
    ];
  }, []);

  // getting all unique country codes
  const uniqueCountryCodes = useMemo(() => {
    return [
      ...new Set(
        Country.getAllCountries().map((country) => ({
          label: "+" + country.phonecode,
          value: "+" + country.phonecode,
        }))
      ),
    ];
  }, []);

  // get all states by country code
  const getAllStatesByCountryCode = (countryName) => {
    const countryCode = Country.getAllCountries().find((country) => country.name == countryName);

    return [
      ...new Set(
        State.getStatesOfCountry(countryCode?.isoCode).map((state) => ({
          label: state.name,
          value: state.name,
        }))
      ),
    ];
  };

  return { uniqueCountryCodes, allCountries, getAllStatesByCountryCode };
};

export default useCountry;
