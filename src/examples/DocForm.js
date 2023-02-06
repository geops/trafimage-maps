/* eslint-disable no-param-reassign */
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
import { getTopicConfig } from '../config/topics';

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

function DocForm({ value, onChange, filter, isIframe, propConfig }) {
  const classes = useStyles();
  const [permalinkParams, setPermalinkParams] = useState(propConfig);
  const url = useMemo(() => {
    return new URL(value);
  }, [value]);
  const { searchParams } = url;

  useEffect(() => {
    const topicKey = url.pathname?.split('/')[1] || propConfig[0].defaultValue;

    if (topicKey) {
      const topic = getTopicConfig('wkp').find((t) => t.key === topicKey);

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

      if (isIframe) {
        // Apply base layers available
        const baseLayers = getLayersAsFlatArray(topic.layers || [])
          .filter((l) => l.get('isBaseLayer'))
          .map((l) => l.key);
        propConfig.find((p) => p.name === 'baselayers').values =
          baseLayers.length > 1 ? baseLayers : [];
        // Apply layers available
        propConfig.find((p) => p.name === 'layers').values =
          layers.length > 1 ? layers : [];
      } else {
        // Apply layers available (TODO: update visible layers dynamically in styleguide, currently crashes the app)
        // propConfig.find((p) => p.name === 'layersVisibility').values =
        // layers.length > 1 ? layers : [];
      }

      setPermalinkParams([...propConfig]);
    }
  }, [url, isIframe, propConfig]);

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
        {permalinkParams
          .filter(filter)
          .map(
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
                            <MenuItem
                              key={val}
                              value={val}
                              disabled={/\(disabled\)$/.test(val)}
                            >
                              {val.replace(/\(disabled\)$/, '')}
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

DocForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  filter: PropTypes.func,
  isIframe: PropTypes.bool,
  propConfig: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      comp: PropTypes.string,
      pathname: PropTypes.bool,
      defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      values: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.array,
        PropTypes.object,
      ]),
      description: PropTypes.func,
    }),
  ).isRequired,
};

DocForm.defaultProps = {
  filter: () => true,
  isIframe: false,
};

export default DocForm;
