| Parameters | Description                    | Examples                                                     |
|------------|--------------------------------|--------------------------------------------------------------|
| x          | x coordinate (EPSG:3857)       | x=925472                                                     |
| y          | y coordinate (EPSG:3857)       | y=5950684                                                    |
| z          | zoom level                     | z=10                                                         |
| layers     | list of layers to be displayed | layers=ch.sbb.netzkarte.stationen,ch.sbb.netzkarte.flughafen |


** 'TrajservLayer' specific parameters: **

| Parameters      | Description            | Examples       |
|-----------------|------------------------|----------------|
| operator_filter | filter by operator     | vbz,zsg      |
| line_filter     | filter by line number  | s9,s15,s10   |
| route_filter    | filter by route number | 00191,00040  |
