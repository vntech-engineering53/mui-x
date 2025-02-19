import * as React from 'react';
import { WrapperVariantContext } from './WrapperVariantContext';
import {
  PickersModalDialog,
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../PickersModalDialog';
import { DateInputPropsLike } from './WrapperProps';
import { PickerStateWrapperProps } from '../../hooks/usePickerState';
import { DateInputSlotsComponent } from '../PureDateInput';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { PickersInputLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

export interface MobileWrapperProps<TDate> {
  children?: React.ReactNode;
  /**
   * Locale for components texts
   */
  localeText?: PickersInputLocaleText<TDate>;
}

export interface MobileWrapperSlotsComponent
  extends PickersModalDialogSlotsComponent,
    DateInputSlotsComponent {}

export interface MobileWrapperSlotsComponentsProps extends PickersModalDialogSlotsComponentsProps {}

export interface InternalMobileWrapperProps<TDate>
  extends MobileWrapperProps<TDate>,
    PickerStateWrapperProps {
  DateInputProps: DateInputPropsLike & { ref?: React.Ref<HTMLDivElement> };
  PureDateInputComponent: React.JSXElementConstructor<DateInputPropsLike>;
  components?: MobileWrapperSlotsComponent;
  componentsProps?: MobileWrapperSlotsComponentsProps;
}

export function MobileWrapper<TDate>(props: InternalMobileWrapperProps<TDate>) {
  const {
    children,
    DateInputProps,
    onAccept,
    onClear,
    onDismiss,
    onCancel,
    onSetToday,
    open,
    PureDateInputComponent,
    components,
    componentsProps,
    localeText,
    ...other
  } = props;

  return (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="mobile">
        <PureDateInputComponent components={components} {...other} {...DateInputProps} />
        <PickersModalDialog
          onAccept={onAccept}
          onClear={onClear}
          onDismiss={onDismiss}
          onCancel={onCancel}
          onSetToday={onSetToday}
          open={open}
          components={components}
          componentsProps={componentsProps}
        >
          {children}
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );
}
