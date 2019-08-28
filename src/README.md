| Parameters | Description                    | Examples                                                     |
|------------|--------------------------------|--------------------------------------------------------------|
| x          | x coordinate (EPSG:3857)       | x=925472                                                     |
| y          | y coordinate (EPSG:3857)       | y=5950684                                                    |
| z          | zoom level                     | z=10                                                         |
| layers     | list of layers to be displayed | layers=ch.sbb.netzkarte.stationen,ch.sbb.netzkarte.flughafen |


** 'TrajservLayer' specific parameters: **

| Options           | Description            | Examples                       |
|-------------------|------------------------|--------------------------------|
| operator          | filter by operator     | Operator=vbz,zsg               |
| publishedLineName | filter by line name    | PublishedLineName=s9,s15,s10   |
| tripNumber        | filter by trip number  | TripNumber=2068,3003,3451,3953 |
