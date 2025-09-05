import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import {
  Box,
  Button,
  Dialog,
  FormControl,
  Grow,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Popper,
  Typography,
  useTheme
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
  PickersCalendarHeaderProps,
  TimeClock,
  TimeField,
  TimeView
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Format } from '../utils';
import { RefObject, useEffect, useRef, useState } from 'react';
import { PickerValue } from '@mui/x-date-pickers/internals';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { OptionType } from '../utils/types';
import theme from '../theme';
import { useResponsive } from '../hooks/useResponsiveHook';

type Props = {
  dateLabel: string;
  timeLabel: string;
  dateLowerBound?: string;
  disableFuture: boolean;
  value: string | undefined;
  onChange: (date: string | undefined, time: string | undefined) => void;
};

type CustomCalendarHeaderProps = PickersCalendarHeaderProps & {
  lowerBound: string | undefined;
};

type CustomTimePickerControlsProps = {
  time: Dayjs | null;
  hoursBackgroundColor: string;
  hoursTextColor: string;
  minsBackgroundColor: string;
  minsTextColor: string;
  timeView: TimeView;
  setHoursActive: () => void;
  setMinsActive: () => void;
  setTimePopperAnchorEl?: (el: HTMLDivElement | null) => void;
  setTimeDialogOpen?: (open: boolean) => void;
  setTime: (value: Dayjs | null) => void;
};

type CustomTimePickerProps = {
  timeLabel: string;
  time: Dayjs | null;
  formControlRef: RefObject<HTMLDivElement | null>;
  setTime: (value: Dayjs | null) => void;
};

const CustomCalendarHeader = (props: CustomCalendarHeaderProps) => {
  const theme = useTheme();

  const { lowerBound, currentMonth, onMonthChange, disableFuture } = props;

  const [monthMenuAnchorEl, setMonthMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [yearMenuAnchorEl, setYearMenuAnchorEl] = useState<null | HTMLElement>(null);
  const monthMenuOpen = Boolean(monthMenuAnchorEl);
  const yearMenuOpen = Boolean(yearMenuAnchorEl);

  const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'));
  const selectPreviousMonth = () => onMonthChange(currentMonth.subtract(1, 'month'));
  const selectNextYear = () => {
    const now = new Date();

    if (currentMonth.get('month') > now.getMonth()) {
      onMonthChange(currentMonth.set('month', now.getMonth()).add(1, 'year'));
    } else {
      onMonthChange(currentMonth.add(1, 'year'));
    }
  };
  const selectPreviousYear = () => {
    if (lowerBound) {
      const lowerBoundDate = new Date(lowerBound);

      if (lowerBoundDate.getMonth() > currentMonth.get('month')) {
        onMonthChange(currentMonth.set('month', lowerBoundDate.getMonth()).subtract(1, 'year'));
      } else {
        onMonthChange(currentMonth.subtract(1, 'year'));
      }
    } else {
      onMonthChange(currentMonth.subtract(1, 'year'));
    }
  };

  const onMonthOptionSelected = (value: string) =>
    onMonthChange(currentMonth.set('month', parseInt(value)));

  const onYearOptionSelected = (value: string) => {
    const parsedValue = parseInt(value);
    const now = new Date();

    if (currentMonth.get('month') > now.getMonth()) {
      onMonthChange(currentMonth.set('month', now.getMonth()).set('year', parsedValue));
    } else if (lowerBound && new Date(lowerBound).getMonth() > now.getMonth()) {
      onMonthChange(
        currentMonth.set('month', new Date(lowerBound).getMonth()).set('year', parsedValue)
      );
    } else if (lowerBound) {
      const lowerBoundDate = new Date(lowerBound);

      if (lowerBoundDate.getMonth() > now.getMonth()) {
        currentMonth.set('month', lowerBoundDate.getMonth()).set('year', parsedValue);
      } else {
        onMonthChange(currentMonth.set('year', parseInt(value)));
      }
    } else {
      onMonthChange(currentMonth.set('year', parseInt(value)));
    }
  };

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const monthOptions = (): OptionType[] => {
    const lowerLimit = lowerBound ? new Date(lowerBound) : undefined;
    let monthIndices = Array.from(Array(12).keys()).filter(
      (i) =>
        (lowerLimit &&
          currentMonth.get('year') === lowerLimit.getFullYear() &&
          i >= lowerLimit.getMonth()) ||
        (!lowerLimit && i)
    );

    if (disableFuture) {
      const now = new Date();
      const monthUpperBound = currentMonth.get('year') === now.getFullYear() ? now.getMonth() : 12;
      monthIndices = monthIndices.filter((n) => n <= monthUpperBound);
    }

    return monthIndices.map((n) => ({
      label: monthNames[n],
      value: n.toString()
    }));
  };

  const yearOptions = (): OptionType[] => {
    const now = new Date();
    const lowerLimit = lowerBound ? new Date(lowerBound) : undefined;
    let yearIndices = Array.from(
      Array(
        Math.max(
          1,
          now.getFullYear() - Math.max(now.getFullYear(), lowerLimit?.getFullYear() ?? -Infinity)
        )
      ).keys()
    );

    const currentYear = now.getFullYear();

    if (disableFuture) {
      yearIndices = yearIndices.filter((n) => n <= currentYear);
    }

    return yearIndices.map((n) => {
      const value = (currentYear - n).toString();
      return {
        label: value,
        value
      };
    });
  };

  const previousMonthOptionDisabled =
    (lowerBound &&
      currentMonth.get('month') === new Date(lowerBound).getMonth() &&
      currentMonth.get('year') === new Date(lowerBound).getFullYear()) ||
    (currentMonth.get('month') === 0 && currentMonth.get('year') === new Date().getFullYear() - 10);

  const nextMonthOptionDisabled =
    (currentMonth.get('month') === 11 || currentMonth.get('month') === new Date().getMonth()) &&
    currentMonth.get('year') === new Date().getFullYear();

  const previousYearOptionDisabled =
    (lowerBound && new Date(lowerBound).getFullYear() === currentMonth.get('year')) ||
    currentMonth.get('year') === new Date().getFullYear() - 10;

  const nextYearOptionDisabled = currentMonth.get('year') === new Date().getFullYear();

  return (
    <Box display="flex" gap={3} marginX="auto" paddingTop={1}>
      <Box display="flex" justifyContent="space-between">
        <IconButton onClick={selectPreviousMonth} disabled={previousMonthOptionDisabled}>
          <ChevronLeftIcon
            htmlColor={previousMonthOptionDisabled ? 'initial' : theme.palette.primary.main}
          />
        </IconButton>
        <Button
          onClick={(event) => setMonthMenuAnchorEl(event.currentTarget)}
          sx={{ color: 'initial', textTransform: 'none' }}
          endIcon={<ArrowDropDownIcon htmlColor={theme.palette.primary.main} />}
        >
          {currentMonth.format('MMM')}
        </Button>
        <Menu
          anchorEl={monthMenuAnchorEl}
          open={monthMenuOpen}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => {
            setMonthMenuAnchorEl(null);
          }}
        >
          {monthOptions().map((option) => (
            <MenuItem
              key={`${option.value}-option`}
              value={option.value}
              selected={currentMonth.get('month').toString() === option.value}
              onClick={() => {
                onMonthOptionSelected(option.value);
                setMonthMenuAnchorEl(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
        <IconButton onClick={selectNextMonth} disabled={nextMonthOptionDisabled}>
          <ChevronRightIcon
            htmlColor={nextMonthOptionDisabled ? 'initial' : theme.palette.primary.main}
          />
        </IconButton>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <IconButton onClick={selectPreviousYear} disabled={previousYearOptionDisabled}>
          <ChevronLeftIcon
            htmlColor={previousYearOptionDisabled ? 'initial' : theme.palette.primary.main}
          />
        </IconButton>
        <Button
          onClick={(event) => setYearMenuAnchorEl(event.currentTarget)}
          sx={{ color: 'initial' }}
          endIcon={<ArrowDropDownIcon htmlColor={theme.palette.primary.main} />}
        >
          {currentMonth.format('YYYY')}
        </Button>
        <Menu
          anchorEl={yearMenuAnchorEl}
          open={yearMenuOpen}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => {
            setYearMenuAnchorEl(null);
          }}
        >
          {yearOptions().map((option) => (
            <MenuItem
              key={`${option.value}-option`}
              value={option.value}
              selected={currentMonth.get('year').toString() === option.value}
              onClick={() => {
                onYearOptionSelected(option.value);
                setYearMenuAnchorEl(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
        <IconButton onClick={selectNextYear} disabled={nextYearOptionDisabled}>
          <ChevronRightIcon
            htmlColor={nextYearOptionDisabled ? 'initial' : theme.palette.primary.main}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

const CustomTimePickerControls = ({
  time,
  hoursBackgroundColor,
  hoursTextColor,
  minsBackgroundColor,
  minsTextColor,
  timeView,
  setHoursActive,
  setMinsActive,
  setTime,
  setTimePopperAnchorEl = undefined,
  setTimeDialogOpen = undefined
}: CustomTimePickerControlsProps) => {
  const [timeClockValue, setTimeClockValue] = useState<Dayjs | null>(time);

  const handleTimeConfirmation = () => {
    setTime(timeClockValue);

    if (setTimePopperAnchorEl) {
      setTimePopperAnchorEl(null);
    } else if (setTimeDialogOpen) {
      setTimeDialogOpen(false);
    }
  };

  return (
    <Box
      component={Paper}
      boxShadow={3}
      display="flex"
      flexDirection="column"
      padding={2}
      gap={1}
      borderRadius="20px"
    >
      <Typography component="span" sx={{ color: theme.palette.text.secondary }}>
        Select time
      </Typography>
      <Box display="flex" marginX="auto" gap={1}>
        <Box
          paddingX={2}
          paddingY="4px"
          borderRadius={3}
          sx={{ cursor: 'pointer', backgroundColor: hoursBackgroundColor }}
          onClick={() => setHoursActive()}
        >
          <Typography sx={{ color: hoursTextColor }} fontSize="2.5rem">
            {timeClockValue?.format('HH') ?? '00'}
          </Typography>
        </Box>
        <Typography component="span" fontSize="2.5rem">
          :
        </Typography>
        <Box
          paddingX={2}
          paddingY="4px"
          borderRadius={3}
          sx={{ cursor: 'pointer', backgroundColor: minsBackgroundColor }}
          onClick={() => setMinsActive()}
        >
          <Typography sx={{ color: minsTextColor }} fontSize="2.5rem">
            {timeClockValue?.format('mm') ?? '00'}
          </Typography>
        </Box>
      </Box>
      <TimeClock
        value={timeClockValue}
        view={timeView}
        onChange={(value) => {
          if (value) {
            setTimeClockValue(dayjs(value));
            if (timeView === 'hours') {
              setMinsActive();
            }
          }
        }}
      />
      <Box display="flex" alignSelf="flex-end" gap={1}>
        <Button
          variant="text"
          onClick={() => handleTimeConfirmation()}
          sx={{ textTransform: 'none' }}
          disabled={!timeClockValue}
        >
          Confirm
        </Button>
        <Button
          variant="text"
          onClick={() => {
            if (setTimePopperAnchorEl) {
              setTimePopperAnchorEl(null);
            } else if (setTimeDialogOpen) {
              setTimeDialogOpen(false);
            }
          }}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

const CustomTimePicker = ({ timeLabel, time, formControlRef, setTime }: CustomTimePickerProps) => {
  const { isMobile } = useResponsive();
  const [timeDialogOpen, setTimeDialogOpen] = useState<boolean>(false);
  const [timePopperAnchorEl, setTimePopperAnchorEl] = useState<null | HTMLElement>(null);
  const timePopperOpen = Boolean(timePopperAnchorEl);
  const [timeView, setTimeView] = useState<TimeView>('hours');
  const [timeClockValue, setTimeClockValue] = useState<Dayjs | null>(null);
  const initialBackgroundColor = 'rgba(0, 0, 0, 0.12)';
  const [hoursBackgroundColor, setHoursBackgroundColor] = useState<string>(initialBackgroundColor);
  const [hoursTextColor, setHoursTextColor] = useState<string>('initial');
  const [minsBackgroundColor, setMinsBackgroundColor] = useState<string>(initialBackgroundColor);
  const [minsTextColor, setMinsTextColor] = useState<string>('initial');

  const onTimeFieldChange = (value: PickerValue) => {
    if (value) {
      setTime(dayjs(value.toString()));
    }
  };

  const setHoursActive = () => {
    setMinsBackgroundColor(initialBackgroundColor);
    setMinsTextColor('initial');
    setHoursBackgroundColor(theme.palette.primary.main);
    setHoursTextColor('#fff');
    setTimeView('hours');
  };

  const setMinsActive = () => {
    setHoursBackgroundColor(initialBackgroundColor);
    setHoursTextColor('initial');
    setMinsBackgroundColor(theme.palette.primary.light);
    setMinsTextColor('#fff');
    setTimeView('minutes');
  };

  return (
    <>
      <TimeField
        label={timeLabel}
        value={time}
        onChange={onTimeFieldChange}
        slotProps={{
          textField: {
            variant: 'filled',
            InputLabelProps: { shrink: true },
            sx: {
              '.MuiPickersInputBase-root': { backgroundColor: '#fff', paddingRight: '4px' },
              '.MuiPickersSectionList-root': { opacity: 1 }
            },
            endAdornment: (
              <Box marginLeft="8px" display="flex" justifyContent="end">
                <IconButton
                  onClick={() => {
                    if (isMobile) {
                      setTimeDialogOpen(true);
                    } else {
                      setTimePopperAnchorEl(timePopperAnchorEl ? null : formControlRef.current);
                    }
                    setHoursActive();
                    if (time && !timeClockValue) {
                      setTimeClockValue(time);
                    }
                  }}
                >
                  <AccessTimeIcon htmlColor={theme.palette.primary.main} />
                </IconButton>
              </Box>
            )
          }
        }}
      />
      {(isMobile && (
        <Dialog
          open={timeDialogOpen}
          onClose={() => {}}
          slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
        >
          <CustomTimePickerControls
            time={time}
            hoursBackgroundColor={hoursBackgroundColor}
            hoursTextColor={hoursTextColor}
            minsBackgroundColor={minsBackgroundColor}
            minsTextColor={minsTextColor}
            timeView={timeView}
            setHoursActive={setHoursActive}
            setMinsActive={setMinsActive}
            setTime={setTime}
            setTimeDialogOpen={setTimeDialogOpen}
          />
        </Dialog>
      )) || (
        <Popper
          open={timePopperOpen}
          anchorEl={timePopperAnchorEl}
          placement="bottom-start"
          sx={{ width: '350px' }}
          transition
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: '0 0 0' }} timeout={350}>
              <Box>
                <CustomTimePickerControls
                  time={time}
                  hoursBackgroundColor={hoursBackgroundColor}
                  hoursTextColor={hoursTextColor}
                  minsBackgroundColor={minsBackgroundColor}
                  minsTextColor={minsTextColor}
                  timeView={timeView}
                  setHoursActive={setHoursActive}
                  setMinsActive={setMinsActive}
                  setTime={setTime}
                  setTimePopperAnchorEl={setTimePopperAnchorEl}
                />
              </Box>
            </Grow>
          )}
        </Popper>
      )}
    </>
  );
};

export const DateAndTimePicker = ({
  dateLabel,
  timeLabel,
  dateLowerBound = undefined,
  disableFuture,
  value,
  onChange
}: Props) => {
  const [date, setDate] = useState<Dayjs | null>(value ? dayjs(value) : null);
  const [time, setTime] = useState<Dayjs | null>(value ? dayjs(value) : null);
  const timeFormControlRef = useRef<HTMLDivElement>(null);

  const onDateChange = (value: PickerValue) => {
    if (value) {
      const isoDate = dayjs(Format.isoDate(value?.toISOString()));
      setDate(dayjs(isoDate));
    }
  };

  const shouldDisableDate = (date: Dayjs) => {
    if (dateLowerBound) {
      const lowerLimit = new Date(dateLowerBound);

      return (
        date.get('year') === lowerLimit.getFullYear() &&
        date.get('month') === lowerLimit.getMonth() &&
        date.get('day') <= lowerLimit.getDay()
      );
    }

    return false;
  };

  useEffect(() => {
    if (date && time) {
      onChange(date?.format('YYYY-MM-DD'), time?.format('HH:mm:ss'));
    }
  }, [date, time]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <Box display="flex" flexDirection="column" flexGrow={1} gap={4} marginTop={2}>
        <FormControl>
          <DatePicker
            label={dateLabel}
            disableFuture={disableFuture}
            shouldDisableDate={shouldDisableDate}
            value={date}
            onChange={onDateChange}
            slots={{
              calendarHeader: (props) =>
                CustomCalendarHeader({ lowerBound: dateLowerBound, ...props })
            }}
            slotProps={{
              popper: { sx: { '.MuiPickerPopper-paper': { borderRadius: '20px' } } },
              layout: { sx: { '.MuiDateCalendar-root': { width: '320px', height: '300px' } } },
              openPickerIcon: { htmlColor: theme.palette.primary.main },
              textField: {
                variant: 'filled',
                InputLabelProps: { shrink: true },
                sx: {
                  '.MuiPickersInputBase-root': { backgroundColor: '#fff' },
                  '.MuiPickersSectionList-root': { opacity: 1 }
                }
              }
            }}
          />
        </FormControl>
        <FormControl ref={timeFormControlRef}>
          <CustomTimePicker
            timeLabel={timeLabel}
            time={time}
            formControlRef={timeFormControlRef}
            setTime={setTime}
          />
        </FormControl>
      </Box>
    </LocalizationProvider>
  );
};
