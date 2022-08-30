import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import Autocomplete from './components/Autocomplete';
import DatePicker from './components/DatePicker';
import TextInput from './components/TextInput/TextInput';
import TimePicker from './components/TimePicker';
// import { Autocomplete, DatePicker, TimePicker } from '../dist';

const propTypes = {
  t: PropTypes.func.isRequired,
};

function App({ t }) {
  const [text, setText] = useState('Random text...');
  const [dates, setDates] = useState('2021-01-31');
  const [select, setSelect] = useState('test10');
  const [time, setTime] = useState('');

  useEffect(() => {
    setTimeout(() => setText(''), 5000);
    setTimeout(() => setTime('18:00'), 3000);
    setTimeout(() => setText('foo'), 3000);
  }, []);

  const handleText = useCallback(({ target: { value } }) => setText(value), []);
  const handleDates = useCallback(({ target: { value } }) => setDates(value), []);
  const handleSelect = useCallback(({ target: { value } }) => setSelect(value), []);
  const handleTime = useCallback(({ target: { value } }) => setTime(value), []);

  return (
    <div className="container-fluid vh-100">
      <form className="row justify-content-center align-items-center h-100">
        <div className="d-flex justify-content-around align-items-end">
          <TextInput
            onChange={handleText}
            value={text}
            name="textValue"
            label={t('global.textInput')}
          />
          <Autocomplete
            onChange={handleSelect}
            value={select}
            list={Array.from({ length: 10 }, (_, i) => {
              const item = {
                key: `test${i + 1}`,
                value: `very long value #${i + 1}`,
                children: [{
                  key: 'test343',
                  value: 'nested value',
                }],
              };

              return item;
            })}
            name="select"
            label={t('global.list')}
            className="col-3"
            language="lv"
            required
          />
          <DatePicker
            onChange={handleDates}
            value={dates}
            name="dates"
            label="Dates"
            highlightDate="2022-07-26"
            highlightColor="#00000044"
            multiselect
            required
          />
          <TimePicker
            onChange={handleTime}
            value={time}
            name="time"
            label="Time"
            className="col-2"
          />
        </div>
      </form>
    </div>
  );
}

App.propTypes = propTypes;

export default withTranslation()(App);
