import React, { useMemo, useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  makeStyles,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { getLayersAsFlatArray } from 'mobility-toolbox-js/ol';
import topics, { getTopicConfig } from '../../config/topics';

const defaultPermalinkParams = [
  {
    name: 'topic',
    type: 'string',
    comp: 'select',
    pathname: true,
    defaultValue: 'ch.sbb.netzkarte',
    values: topics.wkp.map((t) => t.key),
    description: () => {
      return <span>Topic to display</span>;
    },
  },
  {
    name: 'baselayers',
    type: 'string',
    comp: 'select',
    defaultValue: '',
    values: [],
    description: () => {
      return (
        <span>
          Base layer to display, values available are depending of the topic
          selected.
        </span>
      );
    },
  },
  {
    name: 'layers',
    type: 'array<string>',
    comp: 'select',
    defaultValue: '',
    values: [],
    description: () => {
      return (
        <span>
          Layers to display, values available are depending of the topic
          selected.
        </span>
      );
    },
  },
  {
    name: 'disabled',
    type: 'array<string>',
    defaultValue: '',
    comp: 'select',
    values: [
      'baseLayerSwitcher',
      'drawMenu',
      'exportMenu',
      'footer',
      'geolocationButton',
      'header',
      'mapControls',
      'menu',
      'overlay',
      'permalink',
      'shareMenu',
      'search',
      'trackerMenu',
    ],
    description: () => {
      return (
        <span>
          <div>UI elements to hide:</div>
          <br />
          <li>baseLayerSwitcher</li>
          <li>drawMenu</li>
          <li>exportMenu</li>
          <li>footer</li>
          <li>geolocationButtonn</li>
          <li>header</li>
          <li>mapControls</li>
          <li>menu</li>
          <li>overlay </li>
          <li>permalink</li>
          <li>shareMenu</li>
          <li>search</li>
          <li>trackerMenu</li>
          <br />
          <div>Functionnalities to deactivate:</div>
          <br />
          <li>permalink - deactivates auto update of the window url</li>
        </span>
      );
    },
  },
  {
    name: 'lang',
    type: 'string',
    comp: 'select',
    defaultValue: 'de',
    values: ['de', 'fr', 'it', 'en'],
    description: () => {
      return <span>Language of the application.</span>;
    },
    props: { type: 'text' },
  },
  {
    name: 'x',
    type: 'number',
    comp: 'input',
    defaultValue: 925472,
    description: () => {
      return (
        // eslint-disable-next-line react/no-unescaped-entities
        <span>x coordinate of the map's center in Mercator projection.</span>
      );
    },
    props: { type: 'number' },
  },
  {
    name: 'y',
    type: 'number',
    comp: 'input',
    defaultValue: 5920000,
    description: () => {
      return (
        // eslint-disable-next-line react/no-unescaped-entities
        <span>y coordinate of the map's center in Mercator projection.</span>
      );
    },
    props: { type: 'number' },
  },
  {
    name: 'z',
    type: 'number',
    comp: 'input',
    defaultValue: 9,
    description: () => {
      return <span>Zoom level.</span>;
    },
    props: {
      type: 'number',
      inputProps: {
        min: 0,
        max: 20,
      },
    },
  },
  {
    name: 'embedded',
    type: 'boolean',
    comp: 'checkbox',
    defaultValue: false,
    description: () => {
      return (
        <span>
          If true, it improves mouse/touch interactions to avoid conflict with
          parent page.
        </span>
      );
    },
    props: {
      type: 'checkbox',
    },
  },
];

const useStyles = makeStyles(() => {
  return {
    table: {
      margin: '25px 0',

      '& , *': {
        fontFamily: 'Consolas,"Liberation Mono",Menlo,monospace !important',
        fontSize: '13px !important',
      },
      '& .MuiFormControl-root': {
        width: 150,
      },

      '& thead th': {
        fontFamily:
          '"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
        color: 'black !important',
        textAlign: 'left',
      },

      '& th, & td': {
        paddingRight: 16,
        paddingBottom: 8,
        verticalAlign: 'top',
      },
      '& td > span.flex': {
        display: 'flex',
        marginTop: 25,
      },
    },
    colName: {
      width: '10%',
      color: '#690',
    },
    colType: {
      width: '10%',
      color: '#905',
    },
    colDefault: {
      width: '10%',
    },
    colDescription: {
      width: '45%',
    },
    colSelected: {
      width: '25%',
    },
  };
});

function IframeDoc({ value, onChange }) {
  const classes = useStyles();
  const [permalinkParams, setPermalinkParams] = useState(
    defaultPermalinkParams,
  );
  const url = useMemo(() => {
    return new URL(value);
  }, [value]);
  const { searchParams } = url;

  useEffect(() => {
    const topicKey =
      url.pathname?.split('/')[1] || defaultPermalinkParams[0].defaultValue;

    if (topicKey) {
      const topic = getTopicConfig('wkp').find((t) => t.key === topicKey);

      // Apply base layers available
      const baseLayers = getLayersAsFlatArray(topic.layers || [])
        .filter((l) => l.get('isBaseLayer'))
        .map((l) => l.key);
      defaultPermalinkParams.find((p) => p.name === 'baselayers').values =
        baseLayers.length > 1 ? baseLayers : [];

      // Apply layers available
      const layers = getLayersAsFlatArray(topic.layers || [])
        .filter(
          (l) =>
            !l.get('isBaseLayer') &&
            !l.children?.length &&
            !l.children?.some((c) => c.visible) &&
            !l.get('hideInLegend'),
        )
        .map((l) => l.key)
        .reverse();
      defaultPermalinkParams.find((p) => p.name === 'layers').values =
        layers.length > 1 ? layers : [];
      setPermalinkParams([...defaultPermalinkParams]);
    }
  }, [url]);

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th className={classes.colName}>Name</th>
          {/* <th className={classes.colType}>Type</th> */}
          <th className={classes.colDefault}>Default</th>
          <th className={classes.colDescription}>Description</th>
          <th className={classes.colSelected}>Selected</th>
        </tr>
      </thead>
      <tbody>
        {permalinkParams.map(
          ({
            name,
            type,
            defaultValue,
            values,
            description,
            comp,
            props,
            pathname,
          }) => {
            let currentValue = pathname
              ? url.pathname.split('/')[1] || ''
              : searchParams.get(name);

            const isSelectMultiple = comp === 'select' && /Array/i.test(type);

            if (pathname) {
              currentValue = url.pathname.split('/')[1] || '';
            } else if (comp === 'checkbox') {
              currentValue = currentValue === 'true' || currentValue === true;
            } else if (comp === 'select') {
              currentValue = searchParams.get(name);

              if (isSelectMultiple) {
                currentValue = searchParams.get(name)?.split(',');
              }
              if (!currentValue && isSelectMultiple) {
                currentValue = [];
              }
              if (!currentValue) {
                currentValue = '';
              }
            } else if (comp === 'input') {
              if (!currentValue) {
                currentValue = '';
              }
            }

            return (
              <tr key={name}>
                <td className={classes.colName}>
                  <span className="flex">{name}</span>
                </td>
                {/* <td className={classes.colType}>{type}</td> */}
                <td className={classes.colDefault}>
                  <span className="flex">{defaultValue || ''}</span>
                </td>
                <td className={classes.colDescription}>
                  <span className="flex">{description()}</span>
                </td>
                <td className={classes.colSelected}>
                  {comp === 'select' && (
                    <FormControl>
                      <InputLabel id="demo-mutiple-name-label">
                        {name}
                      </InputLabel>
                      <Select
                        labelId="demo-mutiple-name-label"
                        multiple={/Array/i.test(type)}
                        value={currentValue}
                        onChange={(evt) => {
                          if (pathname) {
                            url.pathname = `/${evt.target.value}`;
                          } else {
                            const newValue = isSelectMultiple
                              ? evt.target.value.join(',')
                              : evt.target.value;
                            if (newValue) {
                              searchParams.set(name, newValue);
                            } else {
                              searchParams.delete(name);
                            }
                          }
                          onChange(url.toString());
                        }}
                        MenuProps={{
                          disablePortal: true,
                        }}
                      >
                        {values.map((val) => (
                          <MenuItem key={val} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {comp === 'input' && (
                    <TextField
                      label={name}
                      type={type}
                      value={currentValue}
                      onChange={(evt) => {
                        if (evt.target.value) {
                          searchParams.set(name, evt.target.value);
                        } else {
                          searchParams.delete(name);
                        }

                        onChange(url.toString());
                      }}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...(props || {})}
                    />
                  )}
                  {comp === 'checkbox' && (
                    <FormControl>
                      <FormControlLabel
                        style={{ marginTop: 16 }}
                        control={
                          <Checkbox
                            checked={currentValue}
                            onChange={(evt) => {
                              console.log(name, evt.target.checked);
                              if (evt.target.checked) {
                                searchParams.set(name, evt.target.checked);
                              } else {
                                searchParams.delete(name);
                              }

                              onChange(url.toString());
                            }}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...(props || {})}
                          />
                        }
                        label={name}
                      />
                    </FormControl>
                  )}
                </td>
              </tr>
            );
          },
        )}
      </tbody>
    </table>
  );
}

IframeDoc.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default IframeDoc;
