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

    if (type === 'cities' && countryCode) {
      let cities = [];
      // For countries with states, require stateCode
      const stateCountries = ['US', 'IN', 'AU', 'BR', 'CA', 'MX', 'DE', 'GB', 'FR', 'RU'];
      if (stateCountries.includes(countryCode)) {
        if (!stateCode) {
          return Response.json({ error: 'stateCode required for this country' }, { status: 400 });
        }
        cities = City.getCitiesOfState(countryCode, stateCode);
      } else {
        // For countries without states (like Indonesia), get all cities
        const states = State.getStatesOfCountry(countryCode);
        for (const state of states) {
          const stateCities = City.getCitiesOfState(countryCode, state.isoCode);
          cities.push(...stateCities);
        }
      }
      return Response.json(cities.map(c => ({ name: c.name })));
    }

    return Response.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
