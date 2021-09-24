import React from 'react';

// 对form的一些统一设置放在这里处理,通过context传给FormItem,默认可编辑,列数为2
const FormContext = React.createContext({ disabled: false, column: 2 });

export default FormContext;
