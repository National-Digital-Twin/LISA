// Global imports
import { ChangeEvent, MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { Format } from '../utils';

type Props = {
  id: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};
const DateTimeInput = ({ id, value, onChange }: Props) => {
  const [date, setDate] = useState<string>(value ? Format.isoDate(value) : '');
  const [time, setTime] = useState<string>(value ? Format.time(value) : '');

  const dispatchOnChange = (d: string, t: string) => {
    if (d && t) {
      const parseDate = Date.parse(`${d}T${t}`);
      if (!Number.isNaN(parseDate)) {
        return onChange(new Date(`${d}T${t}`).toISOString());
      }
    }
    return onChange(undefined);
  };

  const onDateChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setDate(evt.target.value);
    dispatchOnChange(evt.target.value, time);
  };
  const onTimeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTime(evt.target.value);
    dispatchOnChange(date, evt.target.value);
  };
  const onSetNow = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    const now = new Date().toISOString();
    const d = Format.isoDate(now);
    const t = Format.time(now);
    setDate(d);
    setTime(t);
    dispatchOnChange(d, t);
  };

  return (
    <div className="log-date-time" id={id}>
      <input className="date-input" type="date" value={date} onChange={onDateChange} />
      <input
        className="time-input"
        type="time"
        min="00:00"
        max="23:59"
        value={time}
        onChange={onTimeChange}
      />
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link className="date-now" to="" onClick={onSetNow}>&lt; Now</Link>
    </div>
  );
};

export default DateTimeInput;
