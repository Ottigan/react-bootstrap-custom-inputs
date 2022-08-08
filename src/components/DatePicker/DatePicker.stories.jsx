import DatePicker from './index';

export default {
  title: 'DatePicker',
  component: DatePicker,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    onChange: {
      action: 'change',
      description: 'Handler `function`',
      type: { name: 'function', required: true },
      table: { category: 'required' },
    },
    name: {
      description: 'Represents State property',
      type: { name: 'string', required: true },
      table: { category: 'required' },
      control: { type: 'text' },
    },
    label: {
      description: 'Enables interaction with the input through it\'s label',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
    },
    value: {
      description: '`string` or `string[]` in RFC2822 or ISO format',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
      control: { type: 'text' },
    },
    highlightDate: {
      description: '`string` in RFC2822 or ISO format',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
      control: { type: 'text' },
    },
    highlightColor: {
      description: '`string` describing color in hexadecimal',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
      control: { type: 'color' },
    },
    language: {
      description: '`string` currently supported values [`en`, `lv`]',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '`en`' }, category: 'optional' },
      control: { type: 'select', options: ['en', 'lv'] },
    },
    className: {
      description: 'Passes classes to the component',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
    },
    multiselect: {
      description: 'Enables selection of multiple dates',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: false }, category: 'optional' },
    },
    alignment: {
      description: '`string` controlling expanded calendar alignment [`left`, `right`]',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '`left`' }, category: 'optional' },
      control: { type: 'select', options: ['left', 'right'] },
    },
    valid: {
      description: 'Overrides default validity if `required` prop is set to `true`',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: 'null' }, category: 'optional' },
    },
    asIcon: {
      description: 'Display component as icon opposed to input field',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: false }, category: 'optional' },
    },
    required: {
      description: '',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: 'false' }, category: 'optional' },
    },
    disabled: {
      description: '',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: 'false' }, category: 'optional' },
    },
    disableDeselect: {
      description: '',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: 'false' }, category: 'optional' },
    },
  },
  args: {
    name: 'date',
    label: 'DatePicker',
    value: '2022-07-27',
    className: '',
    highlightDate: '',
    highlightColor: '',
    valid: null,
    asIcon: false,
    multiselect: false,
    required: false,
    disabled: false,
    disableDeselect: false,
  },
};

function Template(args) {
  return (
    <div style={{ height: '360px' }}>
      <DatePicker {...args} />
    </div>
  );
}

export const Basic = Template.bind({});
Basic.args = {
};

export const Icon = Template.bind({});
Icon.args = {
  asIcon: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
