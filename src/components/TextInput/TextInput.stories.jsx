import TextInput from './index';

export default {
  title: 'TextInput',
  component: TextInput,
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
    },
    label: {
      description: 'Enables interaction with the input through it\'s label',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
    },
    value: {
      description: '',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
    },
    debounce: {
      description: 'Debounce in milliseconds',
      type: { name: 'number', required: false },
      table: { defaultValue: { summary: 0 }, category: 'optional' },
    },
    className: {
      description: 'Passes classes to the component',
      type: { name: 'string', required: false },
      table: { defaultValue: { summary: '' }, category: 'optional' },
    },
    valid: {
      description: 'Overrides default validity if `required` prop is set to `true`',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: 'null' }, category: 'optional' },
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
  },
  args: {
    name: 'text',
    label: 'TextInput',
    value: 'Random text...',
    debounce: 0,
    className: '',
    valid: null,
    required: false,
    disabled: false,
  },
};

function Template(args) {
  return <TextInput {...args} />;
}

export const Basic = Template.bind({});
Basic.args = {
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
