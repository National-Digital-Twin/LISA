import { Request, Response } from 'express';
import { settings } from '../settings';

const key = settings.OS_MAPS_KEY;

interface Query {
  point?: string;
  searchTerm?: string;
}
export async function searchLocation(req: Request<object, object, object, Query>, res: Response) {
  const type = req.query.point ? 'nearest' : 'find';
  const url = new URL(`https://api.os.uk/search/places/v1/${type}`);

  if (type === 'nearest') {
    url.searchParams.set('point', req.query.point);
    url.searchParams.set('srs', 'WGS84');
  } else {
    url.searchParams.set('query', req.query.searchTerm);
    url.searchParams.set('output_srs', 'WGS84');
  }
  url.searchParams.set('lr', 'EN'); 
  url.searchParams.set('key', key);

  const osResp = await fetch(url, {
    method: 'GET'
  });

  if (osResp.status !== 200) {
    res.sendStatus(osResp.status);
    console.log(`OS request has failed with status ${osResp.status}, body: ${await osResp.text()}`);
    return;
  }

  const osData = await osResp.json();

  res.json(osData.results?.map((result) => ({
    value: result.DPA.UPRN,
    label: result.DPA.ADDRESS,
    lat: result.DPA.LAT,
    lon: result.DPA.LNG,
  })));
}
