The Geltungsbereiche topic provides a topic specific for iframe use.

```jsx
import React, { useMemo, useState } from 'react';
import {
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  makeStyles,
} from '@material-ui/core';
import getCodeFromUrl from '../getCodeFromUrl';

const useStyles = makeStyles(() => {
  return {
    params: {
      display: 'grid',
      gridTemplateColumns: '15% 15% 50% 20%',
      rowGap: 20,
      fontFamily: 'Consolas,"Liberation Mono",Menlo,monospace !important',
      fontSize: '13px',
      color: 'rgb(51, 51, 51)',
      '& strong': {
        color: 'black',
        textAlign: 'left',
      },
    },
    parameter: {
      color: '#690',
    },
  };
});

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const apiKey = window.apiKey;
const baseUrl = 'https://maps.trafimage.ch';
const topic = '/ch.sbb.geltungsbereiche-iframe';

const App = () => {
  const classes = useStyles();
  const [embedded, setEmbedded] = useState(true);
  const [url, setUrl] = useState(baseUrl + topic + `?embedded=${embedded}`);

  const code = useMemo(() => {
    return getCodeFromUrl(url);
  }, [url]);

  const urlObject = useMemo(() => {
    return new URL(url);
  }, [url]);

  return (
    <>
      <div className={classes.params}>
        <strong>Name</strong>
        <strong>Default</strong>
        <strong>Description</strong>
        <strong>Selected</strong>
        <span className={classes.parameter}>embedded</span>
        <span>false</span>
        <span>
          If true, it improves mouse/touch interactions to avoid conflict with
          parent page.
        </span>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={embedded}
                onChange={(evt) => {
                  setEmbedded(!embedded);
                  const { searchParams } = urlObject;
                  if (!embedded) {
                    searchParams.set('embedded', true);
                  } else {
                    searchParams.delete('embedded');
                  }

                  setUrl(urlObject.toString());
                }}
              />
            }
            label="embedded"
          />
        </FormControl>
      </div>
      <TextField
        label="Iframe URL"
        variant="outlined"
        value={url}
        margin="normal"
        fullWidth
        onChange={(evt) => {
          const newUrlObj = new URL(evt.target.value);
          const { searchParams } = newUrlObj;
          setEmbedded(searchParams.get('embedded') === 'true');
          setUrl(evt.target.value);
        }}
      />
      <div className="container">
        <iframe src={url} />
      </div>
    </>
  );
};

<App />;
```
