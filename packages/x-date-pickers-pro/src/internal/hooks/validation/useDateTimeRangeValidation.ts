import {
  useValidation,
  Validator,
  DateTimeValidationError,
  validateDateTime,
  BaseDateValidationProps,
  TimeValidationProps,
  ValidationProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../../utils/date-utils';
import { DayRangeValidationProps } from '../../models/dateRange';
import { DateRange } from '../../models/range';

export interface DateTimeRangeComponentValidationProps<TDate>
  extends DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>> {}

export const validateDateTimeRange: Validator<
  DateRange<any>,
  any,
  DateTimeRangeValidationError,
  DateTimeRangeComponentValidationProps<any>
> = ({ props, value, adapter }) => {
  const [start, end] = value;

  // for partial input
  if (start === null || end === null) {
    return [null, null];
  }

  const { shouldDisableDate, ...otherProps } = props;

  const dateTimeValidations: [
    DateTimeRangeValidationErrorValue,
    DateTimeRangeValidationErrorValue,
  ] = [
    validateDateTime({
      adapter,
      value: start,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'start'),
      },
    }),
    validateDateTime({
      adapter,
      value: end,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'end'),
      },
    }),
  ];

  if (dateTimeValidations[0] || dateTimeValidations[1]) {
    return dateTimeValidations;
  }

  if (!isRangeValid(adapter.utils, value)) {
    return ['invalidRange', 'invalidRange'];
  }

  return [null, null];
};

type DateTimeRangeValidationErrorValue = DateTimeValidationError | 'invalidRange' | null;

export type DateTimeRangeValidationError = [
  DateTimeRangeValidationErrorValue,
  DateTimeRangeValidationErrorValue,
];

export const isSameDateTimeRangeError = (
  a: DateTimeRangeValidationError,
  b: DateTimeRangeValidationError | null,
) => b !== null && a[1] === b[1] && a[0] === b[0];

export const useDateRangeValidation = <TDate>(
  props: ValidationProps<
    DateTimeRangeValidationError,
    DateRange<TDate>,
    DateTimeRangeComponentValidationProps<TDate>
  >,
): DateTimeRangeValidationError => {
  return useValidation(props, validateDateTimeRange, isSameDateTimeRangeError);
};
