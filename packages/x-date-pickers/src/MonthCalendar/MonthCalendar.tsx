import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, useTheme } from '@mui/system';
import { styled, useThemeProps, Theme } from '@mui/material/styles';
import {
  unstable_useControlled as useControlled,
  unstable_composeClasses as composeClasses,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { PickersMonth } from './PickersMonth';
import { useUtils, useNow, useDefaultDates } from '../internals/hooks/useUtils';
import { MonthCalendarClasses, getMonthCalendarUtilityClass } from './monthCalendarClasses';
import {
  BaseDateValidationProps,
  MonthValidationProps,
} from '../internals/hooks/validation/models';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { DefaultizedProps } from '../internals/models/helpers';

export interface MonthCalendarProps<TDate>
  extends MonthValidationProps<TDate>,
    BaseDateValidationProps<TDate> {
  autoFocus?: boolean;
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MonthCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /** Date value for the MonthCalendar */
  value: TDate | null;
  /** If `true` picker is disabled */
  disabled?: boolean;
  /**
   * Callback fired when the value (the selected month) changes.
   * @template TValue
   * @param {TValue} value The new value.
   */
  onChange: (value: TDate) => void;
  /** If `true` picker is readonly */
  readOnly?: boolean;
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday?: boolean;
  onMonthFocus?: (month: number) => void;
  hasFocus?: boolean;
  onFocusedViewChange?: (newHasFocus: boolean) => void;
}

const useUtilityClasses = (ownerState: MonthCalendarProps<any>) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getMonthCalendarUtilityClass, classes);
};

export function useMonthCalendarDefaultizedProps<TDate>(
  props: MonthCalendarProps<TDate>,
  name: string,
): DefaultizedProps<
  MonthCalendarProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    disableFuture: false,
    disablePast: false,
    ...themeProps,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

const MonthCalendarRoot = styled('div', {
  name: 'MuiMonthCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: MonthCalendarProps<any> }>({
  width: 310,
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'stretch',
  margin: '0 4px',
});

type MonthCalendarComponent = (<TDate>(
  props: MonthCalendarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const MonthCalendar = React.forwardRef(function MonthCalendar<TDate>(
  inProps: MonthCalendarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const now = useNow<TDate>();
  const theme = useTheme();
  const utils = useUtils<TDate>();

  const props = useMonthCalendarDefaultizedProps(inProps, 'MuiMonthCalendar');

  const {
    className,
    value,
    disabled,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onChange,
    shouldDisableMonth,
    readOnly,
    disableHighlightToday,
    autoFocus = false,
    onMonthFocus,
    hasFocus,
    onFocusedViewChange,
    ...other
  } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const todayMonth = React.useMemo(() => utils.getMonth(now), [utils, now]);

  const selectedDateOrToday = value ?? now;
  const selectedMonth = React.useMemo(() => {
    if (value != null) {
      return utils.getMonth(value);
    }

    if (disableHighlightToday) {
      return null;
    }

    return utils.getMonth(now);
  }, [now, value, utils, disableHighlightToday]);
  const [focusedMonth, setFocusedMonth] = React.useState(() => selectedMonth || todayMonth);

  const [internalHasFocus, setInternalHasFocus] = useControlled<boolean>({
    name: 'MonthCalendar',
    state: 'hasFocus',
    controlled: hasFocus,
    default: autoFocus,
  });

  const changeHasFocus = useEventCallback((newHasFocus: boolean) => {
    setInternalHasFocus(newHasFocus);

    if (onFocusedViewChange) {
      onFocusedViewChange(newHasFocus);
    }
  });

  const isMonthDisabled = useEventCallback((month: TDate) => {
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate,
    );

    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
    );

    if (utils.isBefore(month, firstEnabledMonth)) {
      return true;
    }

    if (utils.isAfter(month, lastEnabledMonth)) {
      return true;
    }

    if (!shouldDisableMonth) {
      return false;
    }

    return shouldDisableMonth(month);
  });

  const handleMonthSelection = useEventCallback((event: React.MouseEvent, month: number) => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setMonth(selectedDateOrToday, month);
    onChange(newDate);
  });

  const focusMonth = useEventCallback((month: number) => {
    if (!isMonthDisabled(utils.setMonth(selectedDateOrToday, month))) {
      setFocusedMonth(month);
      changeHasFocus(true);
      if (onMonthFocus) {
        onMonthFocus(month);
      }
    }
  });

  React.useEffect(() => {
    setFocusedMonth((prevFocusedMonth) =>
      selectedMonth !== null && prevFocusedMonth !== selectedMonth
        ? selectedMonth
        : prevFocusedMonth,
    );
  }, [selectedMonth]);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent, month: number) => {
    const monthsInYear = 12;
    const monthsInRow = 3;

    switch (event.key) {
      case 'ArrowUp':
        focusMonth((monthsInYear + month - monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusMonth((monthsInYear + month + monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusMonth((monthsInYear + month + (theme.direction === 'ltr' ? -1 : 1)) % monthsInYear);

        event.preventDefault();
        break;
      case 'ArrowRight':
        focusMonth((monthsInYear + month + (theme.direction === 'ltr' ? 1 : -1)) % monthsInYear);

        event.preventDefault();
        break;
      default:
        break;
    }
  });

  const handleMonthFocus = useEventCallback((event: React.FocusEvent, month: number) => {
    focusMonth(month);
  });

  const handleMonthBlur = useEventCallback((event: React.FocusEvent, month: number) => {
    if (focusedMonth === month) {
      changeHasFocus(false);
    }
  });

  return (
    <MonthCalendarRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      {utils.getMonthArray(selectedDateOrToday).map((month) => {
        const monthNumber = utils.getMonth(month);
        const monthText = utils.format(month, 'monthShort');
        const isSelected = monthNumber === selectedMonth;
        const isDisabled = disabled || isMonthDisabled(month);

        return (
          <PickersMonth
            key={monthText}
            selected={isSelected}
            value={monthNumber}
            onClick={handleMonthSelection}
            onKeyDown={handleKeyDown}
            autoFocus={internalHasFocus && monthNumber === focusedMonth}
            disabled={isDisabled}
            tabIndex={monthNumber === focusedMonth ? 0 : -1}
            onFocus={handleMonthFocus}
            onBlur={handleMonthBlur}
            aria-current={todayMonth === monthNumber ? 'date' : undefined}
          >
            {monthText}
          </PickersMonth>
        );
      })}
    </MonthCalendarRoot>
  );
}) as MonthCalendarComponent;

MonthCalendar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * className applied to the root element.
   */
  className: PropTypes.string,
  /**
   * If `true` picker is disabled
   */
  disabled: PropTypes.bool,
  /**
   * If `true` disable values before the current time
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true` disable values after the current time.
   * @default false
   */
  disablePast: PropTypes.bool,
  hasFocus: PropTypes.bool,
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate: PropTypes.any,
  /**
   * Callback fired when the value (the selected month) changes.
   * @template TValue
   * @param {TValue} value The new value.
   */
  onChange: PropTypes.func.isRequired,
  onFocusedViewChange: PropTypes.func,
  onMonthFocus: PropTypes.func,
  /**
   * If `true` picker is readonly
   */
  readOnly: PropTypes.bool,
  /**
   * Disable specific months dynamically.
   * Works like `shouldDisableDate` but for month selection view @DateIOType.
   * @template TDate
   * @param {TDate} month The month to check.
   * @returns {boolean} If `true` the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Date value for the MonthCalendar
   */
  value: PropTypes.any,
} as any;
