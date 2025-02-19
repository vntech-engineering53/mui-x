---
title: Componente React Seletor de hora
components: DesktopTimePicker, MobileTimePicker, StaticTimePicker, TimePicker, ClockPicker
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://material.io/components/time-pickers
---

# Seletor de hora

<p class="description">Seletores de horário permitem que o usuário selecione um horário.</p>

Seletores de hora permitem que o usuário selecione um horário simples (no formato de horas:minutos). O horário selecionado é indicado pelo círculo preenchido no final do ponteiro do relógio.

## Utilização Básica

The time picker is rendered as a modal dialog on mobile, and a textbox with a popup on desktop.

{{"demo": "BasicTimePicker.js"}}

## Modo estático

It's possible to render any time picker inline. Isto permitirá construir contêineres customizados de popover/modal.

{{"demo": "StaticTimePickerDemo.js", "bg": true}}

## Responsividade

O componente seletor de hora é projetado e otimizado para o dispositivo em que ele é executado.

- The `MobileTimePicker` component works best for touch devices and small screens.
- The `DesktopTimePicker` component works best for mouse devices and large screens.

By default, the `TimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches. Isto pode ser customizado com a propriedade `desktopModeMediaQuery`.

{{"demo": "ResponsiveTimePickers.js"}}

## Propriedades de formulário

The time picker component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Localização

Use `LocalizationProvider` para alterar a date-library de localização que é usada para renderizar o seletor de hora. O seletor de hora ajustará automaticamente à configuração de horário da localidade, ou seja, ao formato 12 horas ou 24 horas. Isso pode ser controlado com a propriedade `ampm`.

{{"demo": "LocalizedTimePicker.js"}}

## Paisagem

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

## Subcomponentes

Some lower-level sub-components (`ClockPicker`) are also exported. Estes são renderizados sem estar encapsulado ou lógica exterior (campo com mascara, valores de data e validação, etc.).

{{"demo": "SubComponentsTimeCalendars.js"}}

## Segundos

O campo de segundos pode ser usado para seleção de um ponto de tempo exato.

{{"demo": "SecondsTimePicker.js"}}
