import { NextRequest } from 'next/server';
import { Country, State, City } from 'country-state-city';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const countryCode = searchParams.get('countryCode');
  const stateCode = searchParams.get('stateCode');

  try {
    if (type === 'countries') {
      const countries = Country.getAllCountries().map(c => ({
        code: c.isoCode,
        name: c.name,
      }));
      return Response.json(countries);
    }

    if (type === 'states' && countryCode) {
      const states = State.getStatesOfCountry(countryCode).map(s => ({
        code: s.isoCode,
        name: s.name,
      }));
      return Response.json(states);
    }

    if (type === 'cities' && countryCode && stateCode) {
      const cities = City.getCitiesOfState(countryCode, stateCode).map(c => ({
        name: c.name,
      }));
      return Response.json(cities);
    }

    return Response.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
