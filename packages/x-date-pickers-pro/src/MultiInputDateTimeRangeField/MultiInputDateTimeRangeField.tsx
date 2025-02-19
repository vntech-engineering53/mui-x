import * as React from 'react';
import PropTypes from 'prop-types';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { MultiInputDateTimeRangeFieldProps } from './MultiInputDateTimeRangeField.types';
import { useMultiInputDateTimeRangeField } from '../internal/hooks/useMultiInputRangeField/useMultiInputDateTimeRangeField';

const MultiInputDateTimeRangeFieldRoot = styled(
  React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
    <Stack ref={ref} {...props} spacing={2} direction="row" alignItems="center" />
  )),
  {
    name: 'MuiMultiInputDateTimeRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputDateTimeRangeFieldSeparator = styled(
  (props: TypographyProps) => <Typography {...props}>{props.children ?? ' — '}</Typography>,
  {
    name: 'MuiMultiInputDateTimeRangeField',
    slot: 'Separator',
    overridesResolver: (props, styles) => styles.separator,
  },
)({});

type MultiInputDateTimeRangeFieldComponent = (<TDate>(
  props: MultiInputDateTimeRangeFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

const MultiInputDateTimeRangeField = React.forwardRef(function MultiInputDateTimeRangeField<TDate>(
  inProps: MultiInputDateTimeRangeFieldProps<TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiMultiInputDateTimeRangeField',
  });

  const {
    components,
    componentsProps,
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    shouldDisableDate,
    minDate,
    maxDate,
    minTime,
    maxTime,
    minDateTime,
    maxDateTime,
    minutesStep,
    shouldDisableTime,
    disableFuture,
    disablePast,
    ...other
  } = themeProps;

  const ownerState = themeProps;

  const Root = components?.Root ?? MultiInputDateTimeRangeFieldRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: componentsProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ref,
    },
    ownerState,
  });

  const Input = components?.Input ?? TextField;
  const startInputProps: TextFieldProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    ownerState: { ...ownerState, position: 'start' },
  });

  const endInputProps: TextFieldProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    ownerState: { ...ownerState, position: 'end' },
  });

  const Separator = components?.Separator ?? MultiInputDateTimeRangeFieldSeparator;
  const separatorProps = useSlotProps({
    elementType: Separator,
    externalSlotProps: componentsProps?.separator,
    ownerState,
  });

  const {
    startDate: { onKeyDown: onStartInputKeyDown, ref: startInputRef, ...startDateProps },
    endDate: { onKeyDown: onEndInputKeyDown, ref: endInputRef, ...endDateProps },
  } = useMultiInputDateTimeRangeField<TDate, TextFieldProps>({
    sharedProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      minTime,
      maxTime,
      minDateTime,
      maxDateTime,
      minutesStep,
      shouldDisableTime,
      disableFuture,
      disablePast,
    },
    startInputProps,
    endInputProps,
    startInputRef: startInputProps.inputRef,
    endInputRef: endInputProps.inputRef,
  });

  return (
    <Root {...rootProps}>
      <Input
        {...startDateProps}
        inputProps={{
          ...startDateProps.inputProps,
          ref: startInputRef,
          onKeyDown: onStartInputKeyDown,
        }}
      />
      <Separator {...separatorProps} />
      <Input
        {...endDateProps}
        inputProps={{
          ...endDateProps.inputProps,
          ref: endInputRef,
          onKeyDown: onEndInputKeyDown,
        }}
      />
    </Root>
  );
}) as MultiInputDateTimeRangeFieldComponent;

MultiInputDateTimeRangeField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm: PropTypes.bool,
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.any),
  /**
   * If `true` disable values before the current time
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * If `true` disable values after the current time.
   * @default false
   */
  disablePast: PropTypes.bool,
  format: PropTypes.string,
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime: PropTypes.any,
  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime: PropTypes.any,
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate: PropTypes.any,
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime: PropTypes.any,
  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime: PropTypes.any,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange: PropTypes.func,
  /**
   * It prevents the user from changing the value of the field
   * (not from interacting with the field).
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * The currently selected sections.
   * This prop accept four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
   * 3. If a string of type `MuiDateSectionName` is provided, the first section with that name will be selected.
   * 4. If `null` is provided, no section will be selected
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: PropTypes.oneOfType([
    PropTypes.oneOf(['day', 'hour', 'meridiem', 'minute', 'month', 'second', 'year']),
    PropTypes.number,
    PropTypes.shape({
      endIndex: PropTypes.number.isRequired,
      startIndex: PropTypes.number.isRequired,
    }),
  ]),
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} view The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.any),
} as any;

export { MultiInputDateTimeRangeField };
